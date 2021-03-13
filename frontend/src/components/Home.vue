<template>
    <div>
        <div>
            <div class="text-center signaturepad-outer">
                <div ref="signaturepad" id="signature-pad" class="signature-pad">
                    <div class="signature-pad--body">
                        <canvas ref="canvas"></canvas>
                    </div>
                </div>
            </div>
            <div v-if="word" class="word"> {{ word[word_count] }} </div> 
            <div class="footer text-center">
                <div style="margin:5px">
                    <button @click.prevent="savePNGButton" class="btn-info btn btn-lg" ref="png">Save as PNG</button>
                </div>    
                <button @click.prevent="clearButton" class="btn-info btn btn-lg" ref="clear">Clear</button>
                <button @click.prevent="undoButton" class="btn-info btn btn-lg" ref="undo">Undo</button>
                <div style="margin:5px">
                    <button @click.prevent="showPic" class="btn-info btn btn-lg">Show I have drawn</button>
                    <div v-if="picture">
                        <div v-for="pic in picture" :key=pic>
                            <img :src="getImgUrl(pic)">
                        </div>
                    </div>
                  
                </div>
            </div>
            <div>
                
            </div>
        </div>
        
        <login  @login_check='login_check' />
    </div>
</template>

<script>
import signaturepad from 'signature_pad'
import axios from 'axios'
import Login from './Login.vue'
export default {
    data() {
        return {
            word : null,
            word_count : 0,
            canvas : null,
            signaturePad : null,
            login : false,
            username : null,
            password : null,
            picture : null,
            webURl : 'http://localhost:5000'
        }
    },
    components:{ Login },
    methods: {
        savePNGButton(){
            if (this.signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                const path = this.webURl+`/api/getdata`
                var dataURL = this.signaturePad.toDataURL("image/jpeg");
                axios.get(path, { params: { data : dataURL, username : this.username, count : this.word_count} })
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                this.word_count++
            }
            this.signaturePad.clear();
            
        },
        clearButton() {
            this.signaturePad.clear();
        },
        undoButton() {
            var data = this.signaturePad.toData();

            if (data) {
                data.pop(); // remove the last dot or line
                this.signaturePad.fromData(data);
            }
        },
        login_check(param){
            this.username = param[0]
            this.password = param[1]
            this.login = param[2]
        },
        showPic(){
            axios.get(this.webURl+'api/getpic', { params: { username : this.username } })
                .then(response => {
                    var pics = response.data
                    this.picture = pics.split(',')
                   
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getImgUrl(pic) {
            return require('../../image/'+pic)
}

    },
    mounted() {
        this.canvas = this.$refs.canvas
        this.signaturePad = new signaturepad(this.canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext("2d").scale(ratio, ratio);
    
        this.signaturePad.clear();

        //get list
        axios.get(this.webURl+"/api/sendword")
        .then(response => {
            console.log(response.data.list)
            this.word = response.data.list
        })
        .catch(error => {
            console.log(error)
        })
    }
}
</script>

<style scoped>
  .signaturepad-outer{
      width: 70vw;
      height: 70vw;
      margin: 3vw auto;
  }
  .signature-pad {
      position: relative;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      font-size: 10px;
      width: 100%;
      height: 100%;
      /* max-width: 360px;
      max-height: 360px; */
      border: 1px solid #e8e8e8;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
      border-radius: 4px;
      padding: 5%;
      margin: auto;
  }

  .signature-pad::before,
  .signature-pad::after {
      position: absolute;
      z-index: -1;
      content: "";
      width: 40%;
      height: 10px;
      bottom: 10px;
      background: transparent;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  }

  .signature-pad::before {
      left: 20px;
      -webkit-transform: skew(-3deg) rotate(-3deg);
      transform: skew(-3deg) rotate(-3deg);
  }

  .signature-pad::after {
      right: 20px;
      -webkit-transform: skew(3deg) rotate(3deg);
      transform: skew(3deg) rotate(3deg);
  }

  .signature-pad--body {
      position: relative;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      border: 1px solid #f4f4f4;
  }

  .signature-pad--body canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
  }

  .footer {
      height: 300px;
      width: 100%;
      /* background-color: aliceblue; */
  }
  .word{
      font-size: 3.5em;
      font-weight: 500;
  }
</style>
