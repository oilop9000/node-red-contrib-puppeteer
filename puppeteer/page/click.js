const puppetHelpers = require("../../lib/helpers");
module.exports = function (RED) {
  function PuppeteerPageClick(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    // Parse the click count to integer
    nodeConfig.clickCount = parseInt(nodeConfig.clickCount);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the selector from string input or from msg object
        let selector = puppetHelpers.getNoderedSelector(nodeConfig)

        // Waiting for the specified selector
        node.status({
          fill: "blue",
          shape: "ring",
          text: `Wait for ${selector}`,
        });
        
        //Check if the selector could be found in an iframe
        const mainFrame = msg.puppeteer.page.mainFrame();
        const childFrames = mainFrame.childFrames();
        if (childFrames.length === 0) {
          await msg.puppeteer.page.waitForSelector(selector);
          await msg.puppeteer.page.click(selector, nodeConfig);
        } else if(childFrames.length > 0) {
          const result = await puppetHelpers.findElementInFrames(mainFrame, selector);
          await result.frame.click(selector, nodeConfig)
        }
        // await msg.puppeteer.page.click(selector, nodeConfig);

        // Clicking on the specified selector
        node.status({ fill: "blue", shape: "dot", text: `Clicked ${selector}` });

        // Selector clicked sucessfully
        node.status({
          fill: "green",
          shape: "dot",
          text: `Clicked ${selector}`,
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
      $("#node-input-clickCount").val(nodeConfig.clickCount);
      $("#node-input-delay").val(nodeConfig.delay);
      $("#node-input-button").val(nodeConfig.button);
      $("#node-input-name").val(nodeConfig.name);
    }
  }
  RED.nodes.registerType("puppeteer-page-click", PuppeteerPageClick);
};
