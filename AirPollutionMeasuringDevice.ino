#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>
#include <DHT.h>  
#include <Wire.h>
#include <Adafruit_BMP085.h>
#include <TimeLib.h> // Thêm thư viện TimeLib.h
#include <WiFiUdp.h>
#include <NTPClient.h>
#include "FirebaseESP8266.h"
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
const int flashButtonPin = 0; 

int led = 5; 
int buzzer = D6;
DHT dht11(D4, DHT11);
#define MQ2pin 0
float mq2Value;  //variable to store sensor value
Adafruit_BMP085 bmp;
#define FIREBASE_HOST ""
#define FIREBASE_AUTH ""
#define path "/"
#define seaLevelPressure_hPa 1013.25
FirebaseData firebaseData;
String randomString;
String generateRandomString() {
  String randomString = "";
  char charset[] = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; 
  int len = strlen(charset);
  
  for (int i = 0; i < 5; i++) {
    char randomChar = charset[random(len)]; 
    randomString += randomChar;
  }
  
  return randomString;
}


void setup() {  
  Serial.begin(115200);
 
  pinMode(flashButtonPin, INPUT);
  pinMode(led, OUTPUT); 
  pinMode(buzzer, OUTPUT);
  dht11.begin();

  WiFiManager wifiManager;
  randomString = generateRandomString();
  wifiManager.setCustomHeadElement("<style>body{text-align:center;font-family:Arial,Helvetica,sans-serif;}</style>");
  wifiManager.setCustomHeadElement("<h1>Custom WiFi Configuration</h1>");
  wifiManager.setCustomHeadElement("<form method=\"post\" action=\"/wifi/save\">");
  wifiManager.setCustomHeadElement("<label for=\"ssid\">SSID:</label><br>");
  wifiManager.setCustomHeadElement("<input type=\"text\" id=\"ssid\" name=\"ssid\"><br>");
  wifiManager.setCustomHeadElement("<label for=\"password\">Password:</label><br>");
  wifiManager.setCustomHeadElement("<input type=\"password\" id=\"password\" name=\"password\"><br><br>");
  String submitButtonHTML = "<input type=\"submit\" value=\"";
  submitButtonHTML += "Your Device ID: ";
  submitButtonHTML += randomString;
  submitButtonHTML += "\">";
  wifiManager.setCustomHeadElement(submitButtonHTML.c_str());

  
  wifiManager.autoConnect("AirPollutionMeasuring");
    if (!bmp.begin()) {
    Serial.println("BMP180 Not Found. CHECK CIRCUIT!");
    while (1) {}
  }

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  if(!Firebase.beginStream(firebaseData, path))
  {
    Serial.println("Reason: " + firebaseData.errorReason());
    Serial.println();
  }

  Serial.println("Connected:");
  Serial.println(WiFi.localIP());
  Serial.println();
  timeClient.begin();
}

void loop() {
  if (digitalRead(flashButtonPin) == LOW) {
    WiFiManager wifiManager;
    wifiManager.resetSettings();
    ESP.reset();
    Serial.println("WiFi settings reset");
    delay(1000); 
  }
   float temp = dht11.readTemperature();
  int humid = dht11.readHumidity();
  mq2Value = analogRead(MQ2pin);
  float pressure = bmp.readPressure();
  float pressureCalculated = bmp.readSealevelPressure();
  float altitude = bmp.readAltitude();
  float realAltitude = bmp.readAltitude(seaLevelPressure_hPa  * 100);


 Serial.print("Temp: ");
  Serial.println(temp);
  Serial.print("Humidity: ");
  Serial.println(humid);
  Serial.print("CO: ");
  Serial.println(mq2Value);

  Serial.print("Pressure: ");
  Serial.println(pressure);
  Serial.print("Pressure at sealevel (calculated) = ");
  Serial.print(pressureCalculated);
  Serial.println(" Pa");

  Serial.print("Altitude = ");
  Serial.print(altitude);
  Serial.println(" meters");

  Serial.print("Real altitude = ");
  Serial.print(realAltitude);
  Serial.println(" meters");

  timeClient.update();


  time_t vietnamTime = timeClient.getEpochTime() + 7 * 3600;

  int dayVN = day(vietnamTime);
  int monthVN = month(vietnamTime);
  int yearVN = year(vietnamTime);
  int hourVN = hour(vietnamTime);
  int minuteVN = minute(vietnamTime);
  int secondVN = second(vietnamTime);

  String dateTimeStr = String(dayVN) + "-" + String(monthVN) + "-" + String(yearVN) + " " +
                       String(hourVN) + ":" + String(minuteVN) + ":" + String(secondVN);

  Serial.println("Current date and time " + dateTimeStr);


  Serial.println(randomString);




  Firebase.pushFloat(firebaseData , "/Product/" + randomString + "/temperature", temp);    
  Firebase.pushFloat(firebaseData , "/Product/" + randomString + "/humidity", humid);
  Firebase.pushFloat(firebaseData , "/Product/" + randomString + "/co", mq2Value);
  Firebase.pushFloat(firebaseData , "/Product/" + randomString + "/pressure", pressureCalculated);
  Firebase.pushFloat(firebaseData , "/Product/" + randomString + "/altitude", realAltitude);

  delay(5000);
}
