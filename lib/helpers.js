
/**
 * Recursively search for an element in a frame and its children.
 * @param {import('puppeteer').Frame} frame - The frame to search in.
 * @param {string} selector - The selector of the element to search for.
 * @return {Promise<{frame: import('puppeteer').Frame, element: import('puppeteer').ElementHandle}>} - The frame and the element if it is found, otherwise null.
 */
const findElementInFrames = async function (frame, selector) {
    /**
     * Buscar el selector en el frame actual
     * @type {import('puppeteer').ElementHandle}
     */
    const element = await frame.$(selector);
    if (element) {
        /**
         * Retorna el frame y el elemento si se encuentra
         * @type {{frame: import('puppeteer').Frame, element: import('puppeteer').ElementHandle}}
         */
        return { frame, element };
    }

    /**
     * Recorrer los frames hijos recursivamente
     * @type {Array<import('puppeteer').Frame}}
     */
    for (const childFrame of frame.childFrames()) {
        /**
         * Buscar el selector en el frame hijo
         * @type {{frame: import('puppeteer').Frame, element: import('puppeteer').ElementHandle}}
         */
        const result = await findElementInFrames(childFrame, selector);
        if (result) {
            /**
             * Retorna en cuanto se encuentra el elemento
             * @type {{frame: import('puppeteer').Frame, element: import('puppeteer').ElementHandle}}
             */
            return result;
        }
    }

    /**
     * Retorna null si no se encuentra en este frame ni en sus hijos
     * @type {null}
     */
    return null;
}


/**
 * Get the selector from the node configuration.
 * If the type of selector is set to flow or global, it needs to be parsed differently.
 * @param {Object} nodeConfig - The node configuration.
 * @returns {string} The parsed selector.
 */
const getNoderedSelector = function (nodeConfig) {
    let typeSelector = nodeConfig.selectortype != "str"
      ? eval(nodeConfig.selectortype + "." + nodeConfig.selector)
      : nodeConfig.selector;
    // If the type of selector is set to flow or global, it needs to be parsed differently
    if (nodeConfig.selectortype == "flow" || nodeConfig.selectortype == "global") {
      // Parsing the selector
      typeSelector = this.context()[nodeConfig.selectortype].get(
        nodeConfig.selectortype
      );
    }
    return typeSelector;
  }

module.exports = { findElementInFrames: findElementInFrames, getNoderedSelector: getNoderedSelector };