
class Graphics1D
{
    xmin = -5;
    xmax = 5;
    ymin = -5;
    ymax = 5;
    W = 512;
    H = 512;
    gridAmplifier = 1;
    B = 1;
    Fmax = this.ymin; Fmin = this.ymax;
    f = function (x,b) {return x*x-9;};
    zer = new Map();
    zerocount = 0;
    evaluate()
    {
        this.buf = new Map();
        this.Fmax = 0; this.Fmin=0;
        for(let x=this.xmin; x<this.xmax; x += (-this.xmin + this.xmax) / this.W)
        {
            var res  = this.f(x,this.B);
            this.buf[x] = res;
            this.Fmax = Math.max(this.Fmax,res);
            this.Fmin = Math.min(this.Fmin,res);
        }
    }
    draw(dots = "red", axis = "lime", zeros = "indigo", gaps = "magenta", bg = "gray")
    {
        var graph = document.getElementById("C1");
        var ctx = graph.getContext("2d");
        this.B = parseFloat(document.getElementById("b").value);
        this.evaluate();
        let stepx = this.W / (-this.xmin + this.xmax), stepy = this.H / (-this.ymin + this.ymax),
            zerox = -this.xmin * stepx, zeroy = this.ymax * stepy;
        console.log("In draw: ");
        console.log("xmin: "+this.xmin+" xmax "+this.xmax+" ymin "+this.ymin+" ymax "+this.ymax+" Fmin,Fmax "+this.Fmin+" "+this.Fmax);
        console.log("stepx: "+stepx+" stepy "+stepy);
        console.log("zerox:"+zerox+" zeroy "+zeroy);

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, this.W, this.H);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = axis;
        ctx.moveTo(0, zeroy);
        ctx.lineTo(this.W, zeroy);
        ctx.moveTo(zerox, 0);
        ctx.lineTo(zerox, this.H);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = axis;
        for(let i=0;i<=this.W;i+=stepx*this.gridAmplifier)
        {
            ctx.beginPath();
            ctx.moveTo(i,0);
            ctx.lineTo(i,this.H);
            ctx.closePath();
            ctx.stroke();
        }
        for(let j=0;j<=this.H;j+=stepy*this.gridAmplifier)
        {
            ctx.beginPath();
            ctx.moveTo(0,j);
            ctx.lineTo(this.W,j);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = dots;
        ctx.moveTo(zerox + this.xmin * stepx, zeroy - this.f(this.xmin,this.B) * stepy);
        console.log("drawing: "+this.ymin+" "+this.ymax);
        this.zerocount = 0;
        this.zer.clear();
        for (let i = this.xmin; i <= this.xmax; i += (-this.xmin + this.xmax) / this.W)
        {
            if (i!=this.xmin)
            {
                let cur = this.buf[i];
                let prev = this.buf[i - (-this.xmin + this.xmax) / this.W] ;
                if((cur*prev < 0) || (cur==0) ){
                    if((Math.abs(cur - prev) > this.ymax - this.ymin)) //разрыв
                    {
                        //console.log(cur+" "+prev);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.fillStyle = gaps;
                        ctx.arc(zerox + i * stepx, zeroy, stepx / 10, 0, 180);
                        ctx.fill();
                        ctx.closePath();
                        ctx.beginPath();
                    }
                    else
                    {
                        this.zerocount++;
                        this.zer[this.zerocount] = i;
                        //console.log("found root while drawing: "+cur+" "+prev+" "+i);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.fillStyle = zeros;
                        ctx.arc(zerox + i * stepx, zeroy, stepx / 10, 0, 180);
                        ctx.fill();
                        ctx.closePath();
                        ctx.beginPath();
                        let backwards = i - (-this.xmin + this.xmax) / this.W;
                        ctx.moveTo(zerox + backwards*stepx,zeroy - this.buf[backwards]*stepy);
                        ctx.lineTo(zerox + i * stepx, zeroy - this.buf[i] * stepy);
                    }
                }
                else ctx.lineTo(zerox + i * stepx, zeroy - this.buf[i] * stepy);
            }
            else ctx.lineTo(zerox + i * stepx, zeroy - this.buf[i] * stepy);
        }
        ctx.stroke();
        ctx.closePath();


        ctx.font = 25 +"px Consolas";
        ctx.textBaseline = 'ideographic';
        ctx.fillStyle = "black";
        let mx = "(" + this.xmax + ", " + this.ymax + ")", mn = "(" + this.xmin + ", " + this.ymin + ")";
        ctx.fillText(
            mx,
            zerox + this.xmax * stepx - (25 * mx.length) / 1.8,
            zeroy - this.ymax * stepy + 25
        );
        ctx.fillText(mn, zerox + this.xmin * stepx, zeroy - this.ymin * stepy);
    }

    autodraw(dots = "red", axis = "lime", zeros = "indigo", gaps = "magenta", bg = "gray")
    {
        this.evaluate();
        this.ymin = this.Fmin;
        this.ymax = this.Fmax;
        console.log("autodraw "+this.Fmin+" "+this.Fmax);
        this.draw(dots, axis, zeros, gaps, bg);
    }


}

function grid() {
    if(document.getElementById("gridlow").checked)
    {
        document.getElementById("gridamp").style.display = "block";
    }
    else
    {
        document.getElementById("gridamp").style.display = "none";
        x.gridAmplifier = 1;
    }
}

function replaceSpecialSequence(str) {
    //Тригонометрические функции
    str = str.split("cos").join("Math.cos");
    str = str.split("sin").join("Math.sin");
    str = str.split("tan").join("Math.tan");
    str = str.split("aMath.cos").join("Math.acos");
    str = str.split("aMath.sin").join("Math.asin");
    str = str.split("aMath.tan").join("Math.atan");
    str = str.split("pi").join("Math.PI");
    str = str.split("ln2").join("Math.LN2");
    str = str.split("ln10").join("Math.LN10");
    str = str.split("log2e").join("Math.LOG2E");
    str = str.split("log10e").join("Math.LOG10E");
    str = str.split("sqrt1_2").join("Math.SQRT1_2");
    str = str.split("sqrt2").join("Math.SQRT2");
    str = str.split("abs").join("Math.abs");
    str = str.split("ceil").join("Math.ceil");
    str = str.split("exp").join("Math.exp");
    str = str.split("floor").join("Math.floor");
    str = str.split("ln").join("Math.log");
    str = str.split("max").join("Math.max");
    str = str.split("min").join("Math.min");
    str = str.split("pow").join("Math.pow");
    str = str.split("round").join("Math.round");
    str = str.split("lg").join("logab");
    str = str.split("sqrt").join("Math.sqrt");
    str = str.split("e").join("Math.E");
    return str;
}
function replaceDerProblems(str) {
    str = str.split("ln").join("log");
    return str;
}



var x = new Graphics1D();
x.draw();
function CALCULATE()
{
    var If = document.getElementById("func").value,
        Ixmin = parseFloat(document.getElementById("xmin").value),
        Ixmax = parseFloat(document.getElementById("xmax").value),
        Iymin = parseFloat(document.getElementById("ymin").value),
        Iymax = parseFloat(document.getElementById("ymax").value),
        IW = parseFloat(document.getElementById("W").value),
        IH = parseFloat(document.getElementById("H").value);
    console.log(Ixmin, Ixmax, Iymin, typeof (Iymax), IW, IH, If);
    x.H = IH;
    x.W = IW;
    document.getElementById("C1").width = IW;
    document.getElementById("C1").height = IH;
    x.xmax = Ixmax;
    x.xmin = Ixmin;
    x.ymax = Iymax;
    x.ymin = Iymin;
    x.f = function(x,b) {return eval(replaceSpecialSequence(If));}
    if(document.getElementById("gridlow").checked) x.gridAmplifier=parseFloat(document.getElementById("gridamp").value);
    console.log(x.gridAmplifier+" "+typeof(x.gridAmplifier));
    x.b = parseFloat(document.getElementById("b").value);
    x.draw();
}


function autoDraw() {
    var If = document.getElementById("func").value,
        Ixmin = parseFloat(document.getElementById("xmin").value),
        Ixmax = parseFloat(document.getElementById("xmax").value),
        Iymin = parseFloat(document.getElementById("ymin").value),
        Iymax = parseFloat(document.getElementById("ymax").value),
        IW = parseFloat(document.getElementById("W").value),
        IH = parseFloat(document.getElementById("H").value);
    console.log(Ixmin, Ixmax, Iymin, typeof (Iymax), IW, IH, If);
    x.H = IH;
    x.W = IW;
    document.getElementById("C1").width = IW;
    document.getElementById("C1").height = IH;
    x.xmax = Ixmax;
    x.xmin = Ixmin;
    x.f = function(x,b) {return eval(replaceSpecialSequence(If));}
    x.B = document.getElementById("b").value;
    if(document.getElementById("gridlow").checked) x.gridAmplifier=parseFloat(document.getElementById("gridamp").value);
    x.autodraw();
}

console.log(math.derivative('x^2 + x', 'x').toString());

function InitializeFieldsForNewton()
{
    var
        Ixmin = parseFloat(document.getElementById("xmin").value),
        Ixmax = parseFloat(document.getElementById("xmax").value),
        Iymin = parseFloat(document.getElementById("ymin").value),
        Iymax = parseFloat(document.getElementById("ymax").value);
    if(document.getElementById("gridlow").checked) x.gridAmplifier=parseFloat(document.getElementById("gridamp").value);
    x.xmax = Ixmax;
    x.xmin = Ixmin;
    x.ymax = Iymax;
    x.ymin = Iymin;
    x.B = parseFloat(document.getElementById("b").value);
}



function Newton() {
    InitializeFieldsForNewton();
    document.getElementById("pointsholder").innerText="";
    let dx = parseFloat(document.getElementById("dx").value);
    document.getElementById("derone").style.display = "block";
    let der = math.derivative(replaceDerProblems(document.getElementById("func").value),'x').toString();
    document.getElementById("derholder").innerText = der;
    let derfunc = math.parser().evaluate("f(x,b) = "+document.getElementById("derholder").innerText);
    let secder = math.derivative(der,'x').toString();
    let secderfunc = math.parser().evaluate("f(x,b) = "+secder);
    x.f = derfunc;
    x.draw();
    console.log("zeros: "+x.zerocount);
    var displayedpoints = 0;
    for(let i=1; i<=x.zerocount; i++)
    {
        console.log("current zero: "+i+" "+x.zer[i]);
        var xnow = x.zer[i];
        var xnext=xnow-1;
        var iterations = 0;
        while(Math.abs(xnext-xnow)>dx)
        {
            if(xnow==0) {xnext=xnow; break;}
            if(xnext!=xnow-1) xnow = xnext;
            xnext = xnow - (derfunc(xnow,x.B))/(secderfunc(xnow,x.B));
            iterations++;
            if(iterations>10000)
            {
                alert("Something went wrong");
                break;
            }
        }
        console.log("Done for this point. Iterations: "+iterations);
        console.log("I think root's between : "+xnow+" and "+xnext);
        var critical = (derfunc(xnext+0.00001,x.B)*derfunc(xnext-0.00001,x.B)<0);
        if(critical) console.log("and it's critical"); else console.log("and it's not critical");
        if(critical)
        {
            displayedpoints++;
            var fnow = function(x,b) {return eval(replaceSpecialSequence(document.getElementById("func").value));};
            document.getElementById("pointsholder").innerText += "x"+displayedpoints+": "+xnext+"  f(x) = "+fnow(xnext,x.B)+" |  Потребовалось итераций: "+iterations+"\n";
        }
    }
    if(displayedpoints==0) document.getElementById("pointsholder").innerText ="Экстремумы не нашлись :c \n Либо их нет, либо функция не удовлетворяет условиям метода.";
}