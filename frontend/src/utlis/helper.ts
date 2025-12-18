export function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function decodeBase64ToJSON(base64String: string) {
  try {
    // Decode Base64
    const decodedString = atob(base64String);

    // Parse JSON
    const jsonObject = JSON.parse(decodedString);
    return jsonObject;
  } catch (error) {
    console.error("Failed to decode or parse JSON:", error);
    return null;
  }
}
