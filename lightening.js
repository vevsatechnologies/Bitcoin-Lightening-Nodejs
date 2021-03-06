var fs = require('fs');
var grpc = require('grpc');
var lnrpc = grpc.load('rpc.proto').lnrpc;
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'
var lndCert = fs.readFileSync('LND_DIR/tls.cert');
var sslCreds = grpc.credentials.createSsl(lndCert);
var walletUnlocker = new lnrpc.WalletUnlocker('localhost:10009', sslCreds);


var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
    var macaroon = fs.readFileSync("LND_DIR/admin.macaroon").toString('hex');
    var metadata = new grpc.Metadata()
    metadata.add('macaroon', macaroon);
    callback(null, metadata);
  });
var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var lightning = new lnrpc.Lightning('localhost:10009', creds);



var generateSeed = (paraphrase , seed_entropy) => {
	var request = { 
    aezeed_passphrase:paraphrase, 
    seed_entropy: seed_entropy
  } 

walletUnlocker.genSeed(request, function(err, response) {
    console.log(response);
  })

};



var initiateWallet = (wallet_password , cipher_seed_mnemonic, paraphrase, recovery_window) => {
	var request = { 
    wallet_password: wallet_password, 
    cipher_seed_mnemonic: cipher_seed_mnemonic, 
    aezeed_passphrase: paraphrase, 
    recovery_window: recovery_window,
  	};

	walletUnlocker.initWallet(request, function(err, response) {
    console.log(response);
  })

};


var unlockWalletRequest = (wallet_password ,recovery_window) => {
	var request = { 
    wallet_password: wallet_password, 
    recovery_window: recovery_window
  	} 

	walletUnlocker.unlockWallet(request, function(err, response) {
    console.log(response);
  })
};


var changeWalletPassword = (current_password , new_password) => {
	var request = { 
    current_password: current_password, 
    new_password: new_password
  	};

   walletUnlocker.changePassword(request, function(err, response) {
    console.log(response);
  })

};


var walletBalanceRequest = () => {
	var request = {} 
	lightning.walletBalance(request, function(err, response) {
    console.log(response);
  })
};


var channelBalanceRequest = () => {
	var request = {} 
	 lightning.channelBalance(request, function(err, response) {
    console.log(response);
  })
};


var getTransactions = () => {
var request = {} 
 lightning.getTransactions(request, function(err, response) {
    console.log(response);
  })
};


var sendCoinsRequest = (addr , amount , target_conf, sat_per_byte) => {
	var request = { 
    addr: addr, 
    amount: amount, 
    target_conf: target_conf, 
    sat_per_byte: sat_per_byte
  } 
	lightning.sendCoins(request, function(err, response) {
    console.log(response);
  })
};



var getTransactionsRequest = () => {
	 var request = {} 
	var call = lightning.subscribeTransactions(request)
	 call.on('data', function(response) {
    // A response was received from the server.
    console.log(response);
  });
	 call.on('status', function(status) {
    // The current status of the stream.
  });
	call.on('end', function() {
    // The server has closed the stream.
  });
};


var sendManyRequest = (AddrToAmount, target_conf, sat_per_byte) => {
	var request = { 
    AddrToAmount: AddrToAmount, 
    target_conf: target_conf, 
    sat_per_byte: sat_per_byte
  } 
 lightning.sendMany(request, function(err, response) {
    console.log(response);
  })
};


var newAddressRequest = (type) => {
	var request = { 
    type: type 
  } 
 lightning.newAddress(request, function(err, response) {
    console.log(response);
  })
};

var newWitnessAddressRequest = () => {
	var request = {} 
 lightning.newWitnessAddress(request, function(err, response) {
    console.log(response);
  })
};

var signMessageRequest = (msg) => {
	var request = { 
    msg: msg
  } 
 lightning.signMessage(request, function(err, response) {
    console.log(response);
  })
};

var verifyMessageRequest = (msg, signature) => {
	var request = { 
    msg: msg, 
    signature: signature
  } 
lightning.verifyMessage(request, function(err, response) {
    console.log(response);
  })
};

// var connectPeerRequest = () => {
	
// };

// var disconnectPeerRequest = () => {
	
// };

// var listPeersRequest = () => {
	
// };

// var getInfoRequest = () => {
	
// };

// var pendingChannelsRequest = () => {
	
// };

// var listChannelsRequest = () => {
	
// };

// var closedChannelsRequest = () => {
	
// };

// var openChannelRequest = () => {
	
// };

// var openChannel = () => {
	
// };

// var closeChannelRequest = () => {
	
// };

// var sendRequest = () => {
	
// };

// var sendRequestSync = () => {
	
// };

// var sendToRouteRequest = () => {
	
// };

// var sendToRouteRequestSync = () => {
	
// };

