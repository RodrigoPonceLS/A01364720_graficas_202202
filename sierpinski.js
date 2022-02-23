function main() {
  const initialPos = [0, document.getElementById("htmlCanvas").clientWidth]; 
  const length = document.getElementById("htmlCanvas").clientWidth; 
  const innerPos = [0, document.getElementById("htmlCanvas").clientWidth];

  let canvas = document.getElementById("htmlCanvas");
  if (!canvas) {
    console.log("Failed to load the canvas element.");
    return;
  }
  let ctx = canvas.getContext("2d");

  createTriangle(ctx, initialPos, length, 0, [innerPos]); 

  document.getElementById("slider").oninput = function (event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("sliderValue").innerHTML = event.target.value;
    createTriangle(ctx, initialPos, length, event.target.value, [innerPos]);
  };
}
const createTriangle = (

  ctx,
  position,
  length,
  iterations,
  innerTrianglePos
) => {
  if (iterations == 0) {
    innerTrianglePos.forEach((trianglePosition) => {
      drawTriangle(ctx, trianglePosition, length);
    });
  } else {
    length /= 2; 
    innerTrianglePos = [
      position,
      [position[0] + length, position[1]],
      [position[0] + length / 2, position[1] - Math.sin(Math.PI / 3) * length],
    ];
    innerTrianglePos.forEach((trianglePosition) => {
      createTriangle(
        ctx,
        trianglePosition,
        length,
        iterations - 1,
        innerTrianglePos
      );
    });
  }
};

const drawTriangle = (ctx, pos, length) => {
  
  console.log(pos);
  ctx.beginPath();
  ctx.moveTo(...pos);
  ctx.fillStyle = "#6867AC";

  ctx.lineTo(pos[0] + length / 2, pos[1] - length * Math.sin(Math.PI / 3));
  ctx.lineTo(pos[0] + length, pos[1]);
  ctx.lineTo(...pos);
  ctx.closePath();
  ctx.fill();
};

