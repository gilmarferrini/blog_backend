import fs from 'fs';
import path from 'path';

async function deleteImage(filename: string): Promise<void> {
  const imageFolder = path.join(__dirname, '..', '..', 'uploads', filename);

  await fs.promises.unlink(imageFolder);
}

export default deleteImage;
