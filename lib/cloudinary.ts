// Cloudinary Image Upload (Free Alternative to Firebase Storage)

export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // Cloudinary upload preset (you'll create this)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "scanx_shops";
    
    console.log("🔧 Cloudinary config:", { cloudName, uploadPreset });
    
    // Check if configured
    if (cloudName === "your-cloud-name" || !cloudName) {
      throw new Error("Cloudinary cloud name not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to .env.local");
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'scanx-shops');
    
    console.log("📤 Uploading to Cloudinary...");
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Cloudinary error:", data);
      
      // Specific error messages
      if (data.error?.message) {
        throw new Error(`Cloudinary: ${data.error.message}`);
      }
      throw new Error('Upload failed');
    }
    
    console.log("✅ Cloudinary upload successful:", data.secure_url);
    return data.secure_url; // Image URL
    
  } catch (error: any) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
}
