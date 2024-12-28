const puppetHelpers = require("../../lib/helpers");
module.exports = function (RED) {
  function PuppeteerPageFocus(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the selector from string input or from msg object
        let selector = puppetHelpers.getNoderedSelector(nodeConfig)

        // Waiting for the provided selector
        node.status({
          fill: "blue",
          shape: "ring",
          text: `Wait for ${selector}`,
        });
        await msg.puppeteer.page.waitForSelector(selector);

        // Focusing on the provided selector
        node.status({
          fill: "blue",
          shape: "dot",
          text: `Focus to ${selector}`,
        });
        await msg.puppeteer.page.focus(selector);

        // Focused successfully
        node.status({
          fill: "green",
          shape: "dot",
          text: `Focused ${selector}`,
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
    oneditprepare: function oneditprepare() {
      $("#node-input-name").val(this.name);
    }
  }
  RED.nodes.registerType("puppeteer-page-focus", PuppeteerPageFocus);
};
