'use strict';

const co = require('co');
const frida = require('..');

const processName = process.argv[2];

const source = `'use strict';

rpc.exports = {
  listThreads: function () {
    return Process.enumerateThreadsSync();
  }
};
`;

co(function *() {
  const systemSession = yield frida.attach(0);
  const bytecode = yield systemSession.compileScript(source, {
    name: 'bytecode-example'
  });

  const session = yield frida.attach(processName);
  const script = yield session.createScriptFromBytes(bytecode);
  yield script.load();

  const api = yield script.getExports();
  console.log('api.listThreads() =>', yield api.listThreads());

  yield script.unload();
})
.catch(err => {
  console.error(err);
});
