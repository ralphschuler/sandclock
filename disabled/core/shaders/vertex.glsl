precision mediump float;
attribute vec2 a_position;
varying vec2 v_position;
void main()
{
  v_position = a_position;
  gl_Position = vec4(
      a_position.x * 2.0 - 1.0, v_position.y * -2.0 + 1.0, 0.0, 1.0);
}