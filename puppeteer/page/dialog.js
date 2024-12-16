module.exports = function (RED) {

  function PuppeteerDialog(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node
    this.on("input", async function (msg, send, done) {
      try {
        
        // Authenticate
        node.status({ fill: "blue", shape: "dot", text: `Adding dialog listener...` });
        msg.puppeteer.page.on("dialog", async (dialog) => {
          nodeConfig.anwerType == "accept" && nodeConfig.promptText ? await dialog.accept(nodeConfig.promptText) : await dialog.accept();
        });
        // Send the updated msg
        send(msg);
        node.status({ fill: "green", shape: "dot", text: `Dialog listener added` });
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
  }
  setTimeout(() => {
    
  }, 3000);
  RED.nodes.registerType("puppeteer-page-dialog", PuppeteerDialog);
};
