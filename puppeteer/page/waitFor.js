const puppetHelpers = require("../../lib/helpers");
module.exports = function (RED) {
  function PuppeteerPageWaitFor(config) {
    RED.nodes.createNode(this, config);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the selector from string input or from msg object
        let selector = puppetHelpers.getNoderedSelector(config)

        // Waiting for provided selector
        node.status({
          fill: "blue",
          shape: "dot",
          text: `Wait for ${selector}`,
        });
        
        //Check if the selector could be found in an iframe
        const mainFrame = msg.puppeteer.page.mainFrame();
        const childFrames = mainFrame.childFrames();
        if (childFrames.length === 0) {
          await msg.puppeteer.page.waitForSelector(selector);
        } else if(childFrames.length > 0) {
          const result = await puppetHelpers.findElementInFrames(mainFrame, selector);
          await result.frame.waitForSelector(selector)
        }

        // Provided selector exists
        node.status({
          fill: "green",
          shape: "dot",
          text: `${selector} exists`,
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
  RED.nodes.registerType("puppeteer-page-waitFor", PuppeteerPageWaitFor);
};
