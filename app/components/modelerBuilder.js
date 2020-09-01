const ModelBuilder = require('./ModelBuilder.js');

class ModelerBuilder {
  constructor(config){
    this.config = config;
  }
  setModel(name) {
    if (!(name instanceof Array || typeof name === "string")) {
      console.error(`Neysla: A model's name of ${ this.config.name } modeler is not properly defined.`);
      return false;
    }

    return new ModelBuilder(this.config, name);
  }
}

module.exports = ModelerBuilder;
