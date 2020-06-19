module.exports = function (RED) {

  function Alice_Config_Node(config) {
    RED.nodes.createNode(this, config);

    this.username = config.username;
    this.password = config.password;
//    this.token = config.token;
    this.cookies = config.cookies;

    this.scenario_id = config.scenario_id;
    this.scenario_name = config.scenario_name;
    this.speaker_id = config.speaker_id;
    this.speaker_name = config.speaker_name;
    this.debug_enable = config.debug_enable;

    this.closing = false;

    var node = this;

//    node.log("Init Yandex Alice Command");
//    node.log("debug is " + this.debug_enable);

    node.on("close", function(done)
    {
      node.closing = true;
      done();
    });
  }


    RED.nodes.registerType('yandex-alice-login', Alice_Config_Node);
//    RED.nodes.registerType('yandex-alice-login', Alice_Config_Node, {});

};

