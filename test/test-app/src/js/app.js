App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:8545',

  // web3 개체를 가진 앱 시작
  init: function() {
    return App.initWeb3();
  },

  // web3 프로파이더와 스마트 컨트랙트를 설정
  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    return App.initContract();
  },

  // 컨트랙트 객체 생성
  initContract: function() {
      $.getJSON('HelloWorld.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var helloArtifact = data;
    App.contracts.hello = TruffleContract(helloArtifact);

    // Set the provider for our contract
    App.contracts.hello.setProvider(App.web3Provider);

    return App.printWorld();
  });
  },

  // html의 요소와 컨트랙트 함수를 연결
  printWorld : function(){
    var helloInstance;
    App.contracts.hello.deployed().then(function(instance) {
      helloInstance = instance;
      return helloInstance.say();
    }).then(function(world){
      jQuery('#print_test').text(world);
    }).catch(function(err){
      console.log(err.message);
    })
  }
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});