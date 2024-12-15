module.exports = function (RED) {

  function PuppeteerDialog(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node
    // Get Credentials
    var credentials = this.credentials; 
    this.on("input", async function (msg, send, done) {
      try {
        // Get Authentication parameters
        var username;
        var password;
        if (msg._credentials && msg._credentials.user && msg._credentials.password) {
          username = msg._credentials.user;
          password = msg._credentials.password; 
        }else {
          username = credentials.username;
          password = credentials.password;
        }
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
    // oneditprepare: function oneditprepare() {
    //   $("#node-input-name").val(nodeConfig.name);
    //   $("#node-input-username").val(nodeConfig.username);
    //   $("#node-input-password").val(nodeConfig.password);
    // }
  }
  setTimeout(() => {
    
  }, 3000);
  RED.nodes.registerType("puppeteer-page-dialog", PuppeteerDialog, {credentials : {
    username: {type:"text"},
    password: {type:"password"}
  }});
};
