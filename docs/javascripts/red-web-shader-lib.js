/**** 创建时间为:2017-04-13 09:10:21 ****/

/**** Vertex ****/
var vertex_base = "attribute vec2 pos;attribute vec2 texPos;varying vec2 fragCoord;void main(){    gl_Position = vec4(pos.xy,0.0,1.0);    fragCoord = texPos;}";
/**** Vertex ****/

/**** Fragment ****/
var fragment_gaussian_blur = "precision highp float;varying vec2 fragCoord;uniform vec3 resolution;uniform float globalTime;uniform sampler2D iChannel0;float SCurve (float x) {    x = x * 2.0 - 1.0;    return -x * abs(x) * 0.5 + x + 0.5;}vec4 BlurH (sampler2D source, vec2 size, vec2 uv, float radius) {	if (radius >= 1.0)	{		vec4 A = vec4(0.0); 		vec4 C = vec4(0.0); 		float width = 1.0 / size.x;		float divisor = 0.0;         float weight = 0.0;                float radiusMultiplier = 1.0 / radius;       		for (float x = -20.0; x <= 20.0; x++)		{			A = texture2D(source, uv + vec2(x * width, 0.0));                        weight = SCurve(1.0 - (abs(x) * radiusMultiplier));                         C += A * weight;             			divisor += weight; 		}		return vec4(C.r / divisor, C.g / divisor, C.b / divisor, 1.0);	}	return texture2D(source, uv);}void mainImage( out vec4 fragColor, in vec2 fragCoord ){    vec2 uv = fragCoord;	fragColor = BlurH(iChannel0, resolution.xy, uv, 20.0);}void main(){    mainImage(gl_FragColor,fragCoord);}";
var fragment_sobel = "precision highp float;varying vec2 fragCoord;uniform vec3 resolution;uniform float globalTime;uniform sampler2D iChannel0;float r = 5.0;vec3 brightness = vec3(0.2126, 0.7152, 0.0722);float rgb2gray(vec3 color) {    return dot(color.rgb, brightness);}float pixel_operator(float dx, float dy) {    vec4 rgba_color = texture2D( iChannel0, fragCoord + vec2(dx,dy) );    return rgb2gray(rgba_color.rgb);}float sobel_filter(){    float dx = (r * 1.0) / float(resolution.x);    float dy = (r * 1.0) / float(resolution.y);    float s00 = pixel_operator(-dx, dy);    float s10 = pixel_operator(-dx, 0.0);    float s20 = pixel_operator(-dx, -dy);    float s01 = pixel_operator(0.0, dy);    float s21 = pixel_operator(0.0, -dy);    float s02 = pixel_operator(dx, dy);    float s12 = pixel_operator(dx, 0.0);    float s22 = pixel_operator(dx, -dy);    float sx = s00 + 2.0 * s10 + s20 - (s02 + 2.0 * s12 + s22);    float sy = s00 + 2.0 * s01 + s02 - (s20 + 2.0 * s21 + s22);    float mag = length(vec2(sx, sy));    return mag;}void main(){    float graylevel = sobel_filter();    gl_FragColor = vec4(graylevel, graylevel, graylevel, 1.0);}";
/**** Fragment ****/
