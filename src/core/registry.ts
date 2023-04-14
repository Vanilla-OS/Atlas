import AtlasConfig from '@/config'
import { OciImage } from "@/core/image";


class RegistryManager {
  
    async get_tags(image: string) {
      const r = await fetch(`${AtlasConfig.registry}/v2/${image}/tags/list`);
      if (!r.ok) return [];
  
      const json = await r.json();
      return json.tags as string[];
    }
  
    async get_manifest(image: string, tag: string) {
      const r = await fetch(`${AtlasConfig.registry}/v2/${image}/manifests/${tag}`);
      if (!r.ok) return {};
  
      return await r.json();
    }
  
    async get_config(image: string, digest: string) {
      const r = await fetch(`${AtlasConfig.registry}/v2/${image}/blobs/${digest}`);
      if (!r.ok) return {};
  
      return await r.json();
    }
  
    async get_image(image: string, tag: string) : Promise<OciImage>{
      const manifest = await this.get_manifest(image, tag);
      const config = await this.get_config(image, manifest.config.digest);
      const ociImage = new OciImage();
      ociImage.name = image;
      ociImage.size = manifest.layers[0].size;
      ociImage.create_date = new Date(config.history[0].created);
      ociImage.digest = manifest.config.digest;
      ociImage.tag = tag;
      ociImage.size = manifest.layers[0].size;
      ociImage.architecture = config.architecture;
      ociImage.os = config.os;
      ociImage.config = config.config;
      ociImage.history = config.history;

      return ociImage;
    }
  
    async get_images() {
      const images: OciImage[] = [];
  
      const r = await fetch(`${AtlasConfig.registry}/v2/_catalog`);
      if (!r.ok) return images;
  
      const json = await r.json();
      const repositories: string[] = json["repositories"];
  
      for (const image of repositories) {
        const tags = await this.get_tags(image);
  
        for (const tag of tags) {
          images.push(await this.get_image(image, tag));
        }
      }
      return images;
    }

  }
  
export { RegistryManager, OciImage };