class OciImage {
    name!: string;
    size!: number;
    create_date!: Date;
    digest!: string;
    tag!: string;
    architecture!: string;
    os!: string;
    config: any;
    history: any;
    layers: any;
  
    get size_mb() {
      return parseFloat((this.size / 1024 / 1024).toFixed(2));
    }
  
    get size_gb() {
      return parseFloat((this.size_mb / 1024).toFixed(2));
    }

    get pretty_create_date() {
        return this.create_date.toLocaleString();
    }

    get labels() { return this.config["Labels"]; }

    get cmd() { return this.config["Cmd"]; }

    get ports() { return this.config["ExposedPorts"]; }

    get envs() { return this.config["Env"]; }

    get entrypoint() { return this.config["Entrypoint"]; }
  }

  export { OciImage };