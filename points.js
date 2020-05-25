class Point{
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}
	add(p1){
		this.x += p1.x;
		this.y += p1.y;
	}
	sub(p1){
		this.x -= p1.x;
		this.y -= p1.y;
	}
	div(p1){
		this.x /= p1.x;
		this.y /= p1.y
	}
  mul(p1){
		this.x *= p1.x;
		this.y *= p1.y
	}
	assign(){
		return new Point(this.x, this.y)
	}

  avgPoint(listOfPoints){
    var avgpoint = new Point();
    var n = listOfPoints.length;
    listOfPoints.forEach((p) => {
      avgpoint.add(p);
    })
    avgpoint.div(new Point(n, n))
    this.x = avgpoint.x;
    this.y = avgpoint.y;
  }
}
