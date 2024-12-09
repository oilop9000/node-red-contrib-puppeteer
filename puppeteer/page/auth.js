module.exports = function (RED) {

  function PuppeteerHttpAuth(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node
    // Get Credentials
    var credentials = this.credentials; 
    this.on("input", async function (msg, send, done) {
      try {
        // Get Authentication parameters
        var username = msg._credentials.user || credentials.user;
        var password = msg._credentials.password || credentials.password;
        if (!username || !password) {
          throw new Error("Missing username or password");
        }
        // Authenticate
        node.status({ fill: "blue", shape: "dot", text: `Authenticating ${username}...` });
        await msg.puppeteer.page.authenticate({username, password});
        // Send the updated msg
        send(msg);
      } catch (e) {
        // Update the status
        node.status({ fill: "red", shape: "dot", text: e.message });
        // If an error occured
        done(e);
        // And update the message error property
        msg.error = e.message; 
        send(msg);f
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
      $("#node-input-name").val(nodeConfig.name);
      $("#node-input-username").val(nodeConfig.username);
      $("#node-input-password").val(nodeConfig.password);
    }
  }
  RED.nodes.registerType("puppeteer-page-httpauth", PuppeteerHttpAuth, {credentials : {
    username: {type:"text"},
    password: {type:"password"}
  }});
};
