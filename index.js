const oks = require("@okfe/okex-node");

const axios = require("axios").default;
const crypto = require("crypto");
require("dotenv").config();

// const key = process.env.OKX_API_KEY;
// const passphrase = process.env.OKX_PASSPHRASE;
// const secret = process.env.OKX_SECRET_KEY;

const signRequest = (method, path, options = {}) => {
  const timestamp = new Date().toISOString();
  const what = timestamp + method.toUpperCase() + path + (options.body || "");
  console.log("🚀 ~ file: index.js ~ line 14 ~ signRequest ~ what", what);

  const hmac = crypto.createHmac("sha256", secret);
  const signature = hmac.update(what).digest("base64");

  return {
    key,
    passphrase,
    signature,
    timestamp,
  };
};

const getSignature = (method, relativeURI, opts = {}) => {
  const sig = signRequest(method, relativeURI, opts);
  return {
    "OK-ACCESS-KEY": sig.key,
    "OK-ACCESS-PASSPHRASE": sig.passphrase,
    "OK-ACCESS-SIGN": sig.signature,
    "OK-ACCESS-TIMESTAMP": sig.timestamp,
  };
};

function makeOkexGetCalls() {
  const options = {
    method: "get",
    url: "https://www.okx.com/api/v5/asset/convert/currency-pair?fromCcy=USDT&toCcy=BTC",
    headers: {
      ...getSignature(
        "get",
        "/api/v5/asset/convert/currency-pair?fromCcy=USDT&toCcy=BTC"
      ),
      Accept: "application/json",
      "Content-Type": "application/json",
      // "x-simulated-trading": 1,
    },
    // data: JSON.stringify({
    //   baseCcy: "ETH",
    //   quoteCcy: "USDT",
    //   side: "buy",
    //   sz: "30",
    //   szCcy: "USDT",
    //   quoteId: "quoterETH-USDT16461885104612381",
    // }),
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error.response.data);
    });
}

(async function () {
  await makeOkexGetCalls();
})();
