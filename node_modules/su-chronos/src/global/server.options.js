
"use strict";

class server_options_g {
  constructor() {
    this.contents = {
      innerOptions: {
          enableCLI: true,
          logKernelRequests: false
        },
        options: {},
        pod: {}
    };
  }
  getInnerOptions() {
    return this.contents.innerOptions;
  }
  getOptions() {
    return this.contents.options;
  }
  getPod() {
    return this.contents.pod;
  }
  replaceAll(contents) {
    const innerOptions = {...this.contents.innerOptions}
    this.contents = {...contents, innerOptions};
  }
  setinnerOptions(key, value) {
    this.contents.innerOptions[key] = value;
    return void 0; 
  }

  static server_options() {
    if (!server_options_g.instance) {
      server_options_g.instance = new server_options_g();
    }
    return server_options_g.instance;
  }
}

/**This function stores global information passed to the server component during start.*/
const server_options = () => server_options_g.server_options();

export default server_options;
