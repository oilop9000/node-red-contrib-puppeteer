module.exports = function (RED) {

  function PuppeteerHttpAuth(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node
    var username = this.credentials.username;
    var password = this.credentials.password;
    // Retrieve the config node
    this.on("input", async function (msg, send, done) {
      try {
        // Get Authentication parameters
        if (!nodeConfig.username || !nodeConfig.password) {
          throw new Error("Missing username or password");
        }
        
        // Authenticate
        node.status({ fill: "blue", shape: "dot", text: `Authenticating ${credentials.username}...` });
        await msg.puppeteer.page.authenticate(credentials);
        // Send the updated msg
        send(msg);
      } catch (e) {
        // If an error occured
        node.error(e);
        // Update the status
        node.status({ fill: "red", shape: "dot", text: e });
        // And update the message error property
        msg.error = e;
        send(msg);
      }

      // Clear status of the node
      setTimeout(
        () => {
          done();
          node.status({});
        },
        msg.error ? 10000 : 3000
      );
    });
    this.on("close", function () {
      node.status({});
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-user").val(nodeConfig.user);
      $("#node-input-password").val(nodeConfig.password);
    }
  }
  RED.nodes.registerType("puppeteer-page-httpauth", PuppeteerHttpAuth, {credentials : {
    username: {type:"text"},
    password: {type:"password"}
  }});
};
