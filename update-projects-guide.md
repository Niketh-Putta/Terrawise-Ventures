# How to Update Your Real Estate Projects

## Quick Database Updates

You can update projects directly using SQL commands. Here are examples:

### Update a Single Project
```sql
UPDATE projects 
SET 
  name = 'Your New Project Name',
  location = 'Your Location, City',
  price = '₹60L+',
  description = 'Your project description here...',
  image_url = 'https://your-image-url.com/image.jpg'
WHERE id = 1;
```

### Update Project Images
```sql
UPDATE projects SET image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' WHERE id = 1;
UPDATE projects SET image_url = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' WHERE id = 2;
UPDATE projects SET image_url = 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600' WHERE id = 3;
```

### Update Amenities (JSON format)
```sql
UPDATE projects 
SET amenities = '["Swimming Pool", "Clubhouse", "Security", "Landscaping", "Your Custom Amenity"]'
WHERE id = 1;
```

## Step-by-Step Process

### Option 1: Modify Seed File (For Complete Replacement)
1. Edit `server/seed.ts`
2. Replace the `sampleProjects` array with your data
3. Delete existing data: `npm run db:reset` (if you create this script)
4. Reseed: `npm run db:seed` (if you create this script)

### Option 2: Direct SQL Updates (For Individual Changes)
1. Use the SQL tool in this environment
2. Run UPDATE commands for specific projects
3. Changes take effect immediately

### Option 3: Create Admin Interface (Advanced)
You could add an admin interface to manage projects through the web interface.

## Image Sources

### Free Stock Photos
- Unsplash: `https://unsplash.com/s/photos/real-estate`
- Use format: `https://images.unsplash.com/photo-ID?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`

### Your Own Images
1. Upload to image hosting (Cloudinary, AWS S3, etc.)
2. Get direct URL
3. Update database with new URL

### Local Images
1. Create `client/public/images` folder
2. Place images there
3. Reference as `/images/your-image.jpg`