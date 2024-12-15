const puppetHelpers = require("../../lib/helpers");
module.exports = function (RED) {
  function PuppeteerPageWaitForTimeout(config) {
    RED.nodes.createNode(this, config);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the selector from string input or from msg object
        let timeout = msg.timeout || config.timeout;
        // Waiting for provided selector
        node.status({
          fill: "blue",
          shape: "dot",
          text: `Wait for ${timeout} milliseconds`,
        });
        
        await msg.puppeteer.page.waitForTimeout(timeout);
        // Timeout passed
        node.status({
          fill: "green",
          shape: "dot",
          text: `${timeout} milliseconds passed`,
        });
        // Sending the msg
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
      setTimeout(() => {
        done();
        node.status({});
      }, (msg.error) ? 10000 : 3000);
    });
    this.on("close", function () {
      node.status({});
    });
  }
  RED.nodes.registerType("puppeteer-page-waitForTimeout", PuppeteerPageWaitForTimeout);
};
