<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <canvas class="imageCanvas" :id="canvasid"></canvas>
</template>

<script>
export default {
  props: [
    "editMode",
    "imageSrc",
    "imageFields",
    "focusedFieldIndex",
    "width",
    "height",
    "maxRooms",
  ],
  created() {
    //To prevent duplicate ids between separate instances
    this.canvasid = Math.ceil(Math.random() * 1000000);
  },
  mounted() {
    this.previewImg = new Image();
    this.previewImg.onerror = () => {
      const canvas = document.getElementById(this.canvasid);
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    };
    this.previewImg.alt = "";
    this.previewImg.src = this.imageSrc;
    this.previewImg.onload = () => {
      if (this.previewImg.src) {
        const canvas = document.getElementById(this.canvasid);
        if (canvas) {
          canvas.width = this.previewImg.width;
          canvas.height = this.previewImg.height;
          this.refreshImageCanvas();
        }
      }
    };
  },
  watch: {
    imageSrc: function (newSrc) {
      if (newSrc instanceof File) {
        this.applyDataURLToCanvas(newSrc);
      } else {
        this.previewImg.src = newSrc;
      }
    },
    imageFields: {
      deep: true,
      handler: function () {
        this.refreshImageCanvas();
      },
    },
    focusedFieldIndex() {
      this.refreshImageCanvas();
    },
    width: {
      handler: function () {
        this.refreshImageCanvas();
      },
    },
    height: {
      handler: function () {
        this.refreshImageCanvas();
      },
    },
    maxRooms: {
      handler: function () {
        this.refreshImageCanvas();
      },
    },
  },
  methods: {
    refreshImageCanvas() {
      const canvas = document.getElementById(this.canvasid);
      if (this.previewImg && canvas.width > 0 && canvas.height > 0) {
        let context = canvas.getContext("2d");
        // clear screen
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw image
        if (this.previewImg.height > 0 && this.previewImg.width > 0) {
          context.drawImage(this.previewImg, 0, 0);
        }

        context.lineWidth = 3;

        if (this.imageFields) {
          this.imageFields.forEach((f, index) => {
            context.font = `${f.fontSize}px sans-serif`;
            context.fillText(f.customText, f.xPos, f.yPos);

            // draw repeats
            if (this.maxRooms > 1 && !f.fixed) {
              let roomHeight = this.height / this.maxRooms;
              for (let room = 1; room <= this.maxRooms; room++) {
                let y = parseInt(f.yPos) + (roomHeight * room);
                context.fillText(f.customText, f.xPos, y);
              }
            }

            if (this.focusedFieldIndex === index) {
              //Draw text field boundaries
              const xPos = parseInt(f.xPos);
              const yPos = parseInt(f.yPos) - parseInt(f.fontSize);
              const width = parseInt(f.width);
              const height = parseInt(f.height);

              //Draw upper border
              this.drawDashedLine(context, xPos, yPos, xPos + width, yPos);
              //Draw right border
              this.drawDashedLine(
                context,
                xPos + width,
                yPos,
                xPos + width,
                yPos + height
              );
              //Draw bottom border
              this.drawDashedLine(
                context,
                xPos,
                yPos + height,
                xPos + width,
                yPos + height
              );
              //Draw left border
              this.drawDashedLine(context, xPos, yPos, xPos, yPos + height);
            }
          });
        }
        // draw room split lines
        if (this.maxRooms > 1) {
          let roomHeight = this.height / this.maxRooms;
          for (let i = 1; i < this.maxRooms; i++) {
            let y = roomHeight * i;
            this.drawDashedLine(context, 0, y, this.width, y);
          }
        }
      }
    },
    applyDataURLToCanvas(newSrc) {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.previewImg.src = reader.result;
      };

      if (newSrc) {
        reader.readAsDataURL(newSrc);
      } else {
        this.previewImg.src = "";
      }
    },
    drawDashedLine(canvasContext, x1, y1, x2, y2) {
      canvasContext.beginPath();
      canvasContext.setLineDash([13, 15]);
      canvasContext.moveTo(x1, y1);
      canvasContext.lineTo(x2, y2);
      canvasContext.stroke();
    },
  },
};
</script>

<style scoped>
.imageCanvas {
  filter: grayscale(100%);
  border: 2px solid;
  position: relative;
}
</style>
