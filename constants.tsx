import React from 'react';

export const DEFAULT_CONFIG = {
  userName: 'webhotelbookingAPIsandbox',
  merchantGuid: 'e71b4e16-c32b-424a-8df9-7849c1d0347e',
  deviceGuid: 'fb845d1c-6db2-46fb-adcd-7d94b75ec649',
  salesUrl: 'https://sandboxsalesapi.connexpay.com'
};

export const PHP_INIT_SNIPPET = (config: any) => `<?php
// 1. Get Authentication Token
$ch = curl_init("${config.salesUrl}/api/v1/token");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'password',
    'username' => '${config.userName}',
    'password' => 'YOUR_PASSWORD'
]));
$response = json_decode(curl_exec($ch), true);
$accessToken = $response['access_token'];

// 2. Initiate 3DS Authentication
$payload = [
    "Card" => [
        "CardHolderName" => "Anil Kumar",
        "CardNumber" => "5204730000001011",
        "ExpirationDate" => "2410",
        "CVV2" => "998",
        "Customer" => [
            "FirstName" => "Anil", "LastName" => "Kumar", "Email" => "test@merchant.com",
            "City" => "Delhi", "State" => "DL", "Country" => "IN", "Phone" => "+919999999999"
        ]
    ],
    "Amount" => 100,
    "DeviceGuid" => "${config.deviceGuid}",
    "BrowserData" => [
        "JavaEnabled" => true,
        "AcceptanceHeader" => $_SERVER['HTTP_ACCEPT'] ?? "*/*",
        "ColorDepth" => 24,
        "ScreenHeight" => 1080,
        "ScreenWidth" => 1920,
        "TimeZoneOffset" => -330,
        "Language" => "en-US",
        "RedirectUrl" => "https://yourdomain.com/3ds-return",
        "UserAgentHeader" => $_SERVER['HTTP_USER_AGENT'] ?? "Mozilla/5.0"
    ]
];

$ch = curl_init("${config.salesUrl}/api/v1/3ds");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $accessToken", "Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
$authResponse = json_decode(curl_exec($ch), true);

// Check if Challenge is required
if (isset($authResponse['acsUrl'])) {
    // REDIRECT USER OR RENDER IFRAME
    header("Location: " . $authResponse['acsUrl']);
}
?>`;
