/*
BSD 3-Clause License

Copyright (c) 2019, smileycreations15 (me@smileycreations15.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var pow = loadModule("proof-of-work.js")
var { sha512 } = loadModule('sha.js');
module.exports.Block = class Block {
  constructor(data, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = Number(new Date());
    this.data = data;
    this.hash = "";
    this.nonce = 0;
  }
  mineBlock(difficulty,prevHash) {
    var res = pow.solve(JSON.stringify({data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}),difficulty)
    this.pow = res
    this.nonce = Number(res.split("x")[1])
    this.previousHash = prevHash
    this.hash = sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))
  }
  calculateHash(){
    return sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))
  }
}
module.exports.RemoteBlock = class RemoteBlock {
  constructor(obj) {
    this.previousHash = obj.previousHash;
    this.timestamp = obj.timestamp;
    this.data = obj.data;
    this.hash = obj.hash;
    this.nonce = obj.nonce;
    this.pow = obj.pow;
  }
  calculateHash(){
    return sha512(JSON.stringify({nonce:this.nonce,data:this.data,timestamp:this.timestamp,previousHash:this.previousHash}))
  }
}
module.exports.Blockchain = class Blockchain {
  constructor(difficulty) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty
  }
  createGenesisBlock(){
    return new module.exports.Block(null);
  }
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  addBlock(block){
    var newBlock = block
    this.chain.push(newBlock);
  }
  isChainValid(){
    for (let i = 1; i < this.chain.length; i++){
      if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;
      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false;
      if (pow.verify(JSON.stringify({data:this.chain[i].data,timestamp:this.chain[i].timestamp,previousHash:this.chain[i].previousHash}),this.chain[i].pow))
      if (String(this.chain[i].nonce) !== this.chain[i].pow.split("x")[1]) return false
    }
    if (this.chain[0].data === null) return true;
    return false
  }
}
module.exports.RemoteBlockchain = class RemoteBlockchain {
  constructor(obj) {
    this.chain = [new module.exports.Block(null)];
    for (var i = 1;i !== obj.chain.length;i++){
      this.chain[this.chain.length] = new module.exports.RemoteBlock(obj.chain[i])
    }
    this.difficulty = obj.difficulty
  }
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  addBlock(block){
    var newBlock = block
    this.chain.push(newBlock);
  }
  isChainValid(){
    for (let i = 1; i < this.chain.length; i++){
      if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;
      if (this.chain[i].hash !== this.chain[i].calculateHash()) return false;
      if (pow.verify(JSON.stringify({data:this.chain[i].data,timestamp:this.chain[i].timestamp,previousHash:this.chain[i].previousHash}),this.chain[i].pow))
      if (String(this.chain[i].nonce) !== this.chain[i].pow.split("x")[1]) return false
    }
    if (this.chain[0].data === null) return true;
    return false
  }
}
