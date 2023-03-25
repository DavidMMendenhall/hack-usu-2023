const boundingBoxPrototype = {
  collidesWith(other) {
    return !(
      other.x2 < this.x1 ||
      other.x1 > this.x2 ||
      other.y2 < this.y1 ||
      other.y1 > this.y2
    );
  },

  get x1() { return this._x1 },
  get x2() { return this._x2 },
  get y1() { return this._y1 },
  get y2() { return this._y2 },
  get w() { return this._w },
  get h() { return this._h },
  get cx() { return this._cx },
  get cy() { return this._cy },

  set x1(nx) { 
    this._x1 = nx;
    this._x2 = nx + this._w;
    this._cx = nx + this._w / 2;
  },

  set x2(nx) { 
    this._x2 = nx;
    this._x1 = nx - this._w;
    this._cx = nx - this._w / 2;
  },

  set y1(ny) { 
    this._y1 = ny;
    this._y2 = ny + this._h;
    this._cy = ny + this._h / 2;
  },

  set y2(ny) { 
    this._y2 = ny;
    this._y1 = ny - this._h;
    this._cy = ny - this._h / 2;
  },

  set w(nw) { 
    this._w = nw;
    this._x2 = this._x1 + nw;
    this._cx = this._x1 + nw / 2;
  },

  set h(nh) { 
    this._h = nh;
    this._y2 = this._y1 + nh;
    this._cy = this._y1 + nh / 2;
  },

  set cx(nx) {
    let hw = this._w / 2;
    this._cx = nx;
    this._x1 = nx - hw;
    this._x2 = nx + hw;
  },

  set cy(ny) {
    let hh = this._h / 2;
    this._cx = ny;
    this._y1 = ny - hh;
    this._y2 = ny + hh;
  }
};

function BoundingBox(spec) {
  if (
    spec.hasOwnProperty("x") &&
    spec.hasOwnProperty("y") &&
    spec.hasOwnProperty("w") &&
    spec.hasOwnProperty("h")
  ) {
    return {
      __proto__: boundingBoxPrototype,
      _x1: spec.x,
      _x2: spec.x + spec.w,
      _y1: spec.y,
      _y2: spec.y + spec.h,
      _w: spec.w,
      _h: spec.h,
      _cx: spec.x + spec.w / 2,
      _cy: spec.y + spec.h / 2,
    };
  } else if (
    spec.hasOwnProperty("x1") &&
    spec.hasOwnProperty("x2") &&
    spec.hasOwnProperty("y1") &&
    spec.hasOwnProperty("y2")
  ) {
    return {
      __proto__: boundingBoxPrototype,
      _x1: spec.x1,
      _x2: spec.x2,
      _y1: spec.y1,
      _y2: spec.y2,
      _w: spec.x2 - spec.x1,
      _h: spec.y2 - spec.y1,
      _cx: spec.x1 + (spec.x2 - spec.x1) / 2,
      _cy: spec.y1 + (spec.y2 - spec.y1) / 2,
    };
  }
}
