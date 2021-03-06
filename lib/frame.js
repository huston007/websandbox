import Connection from './connection';

class Frame {
  constructor() {
    this.connection = new Connection(
      window.parent.postMessage.bind(window.parent),
      listener => {
        window.addEventListener('message', listener);
      }
    );

    this.connection.setServiceMethods({
      runCode: code => this.runCode(code),
      importScript: path => this.importScript(path),
      injectStyle: style => this.injectStyle(style),
      importStyle: path => this.importStyle(path)
    });

    this.connection.callRemoteServiceMethod('iframeInitialized');
  }

  /**
     * Creates script tag with passed code and attaches it. Runs synchronous
     * @param code
     */
  runCode(code) {
    var scriptTag = document.createElement('script');
    scriptTag.innerHTML = code;
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
  }

  importScript(scriptUrl) {
    var scriptTag = document.createElement('script');
    scriptTag.src = scriptUrl;
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
    return new Promise(resolve => scriptTag.onload = () => resolve());
  }

  injectStyle(style) {
    var styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(styleTag);
  }

  importStyle(styleUrl) {
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = styleUrl;
    document.getElementsByTagName('head')[0].appendChild(linkTag);
  }
}

const Websandbox = new Frame();
window.Websandbox = window.Websandbox || Websandbox;
module.exports = Websandbox; // eslint-disable-line
