import requests
import json
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# Hämta väderdata från OpenWeatherMap
url = 'https://api.openweathermap.org/data/2.5/weather?q=Stockholm&appid=d7b75f77ece57509bea8e378d44317d7'

response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("Väderdata från API:")
    print(json.dumps(data, indent=4))
else:
    print(f"Failed to fetch weather data: {response.status_code}")

# S3- och Rekognition-konfiguration
bucket_name = 'weatherwestbucket12'
image_name = 'weather2.jpg'

# Skapa S3-klienten
s3_client = boto3.client('s3', region_name='eu-west-1')

try:
    # Försök att hämta filen från S3 för att verifiera åtkomst
    s3_client.head_object(Bucket=bucket_name, Key=image_name)
    print(f"Successfully verified access to {image_name} in {bucket_name}")
except s3_client.exceptions.NoSuchKey:
    print(f"The file {image_name} does not exist in the bucket {bucket_name}")
    exit()
except Exception as e:
    print(f"Error accessing S3: {e}")
    exit()

# Skapa Rekognition-klienten
rekognition_client = boto3.client('rekognition', region_name='eu-west-1')

# Anropa Rekognition om S3-åtkomst fungerar
try:
    rekognition_response = rekognition_client.detect_labels(
        Image={'S3Object': {'Bucket': bucket_name, 'Name': image_name}},
        MaxLabels=10,  # Max antal etiketter att få tillbaka
        MinConfidence=75  # Minsta konfidensnivå för att acceptera etiketter
    )

    # Skriv ut och spara Rekognition-etiketter
    print("\nRekognition-etiketter:")
    labels = []
    for label in rekognition_response['Labels']:
        print(f"Label: {label['Name']}, Confidence: {label['Confidence']:.2f}%")
        labels.append({
            'Name': label['Name'],
            'Confidence': label['Confidence']
        })

    # Spara etiketter till en JSON-fil
    with open('rekognition_labels.json', 'w') as json_file:
        json.dump(labels, json_file, indent=4)

except Exception as e:
    print(f"Error using Rekognition: {e}")
