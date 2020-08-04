// colors for bar of different condition
var colors = ["#822bc4", "#472c2f", "#2fcdd8", "#f7dd11", "#91b1b5", "#cdace6"];

var tduration = 200;
var curDescent = "None", curYear = "None";
var curScene = -1;
var lastScene = 5;

function Years(col = 0, indices = [-1]) {
  d3.select("#ch1header").html("Year Arrest Occurred");
 
  d3.csv("yearly_count.csv", function(error, data) {
    
    var pw = parseInt(d3.select("#chart1td").style("width"), 10),
      rightm = 10, leftm = 10,
      w = pw - rightm - leftm,
      h = 500;

    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Count = +d.count;
    });

    var macCnt = d3.max(data, function(d) {return d.Count;});

    var n = data.length;

    var canvas = d3
      .select("#Hours")
      .attr("width", pw)
      .attr("height", h);

    var t = canvas.selectAll("text").data(data);
    t.enter()
      .append("text")
      .merge(t)
      .text(function(d) {
        return d.Year;
        })
      .style("text-anchor", "middle")
      .style("font-size", "0.9em")
      .attr("fill", "black")
      .attr("width", w / (n + 2.8))
      .attr("x", function(d, i) {
        return leftm + (i * w) / n + w / (2 * n);
        })
      .attr("y", h * 0.98);      
      
    var rects = canvas.selectAll(".yearsBars").data(data);

    var div = d3.select(".tooltip").style("opacity", 0.2);

    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", function(d) {
        div.transition("TooltipIn")
            .duration(tduration)
            .style("opacity", 0.9);
            
        div.html("Year: " +  d.Year + "<br/>" + "Arrests: " + d.Count)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
            
            if (curScene === lastScene) {
              if (d.Year != curYear) {
                d3.select(this).attr("fill", colors[1]);
              }
            }
        })
      .on("mouseout", function(d) {
          div.style("opacity", 0);
          
          if (curScene === lastScene) {
            var cind = -1;
            if ("None" === curYear) {
                cind = 0;
            }
            if ((curYear != d.Year) & ("None" != curYear)) {
                cind = 5;
              
            }
            if (cind >= 0) {
                d3.select(this)
                .attr("fill", colors[cind])
                .transition("mouseOutYearTransition");
            }
            
          }}  )
      .on("click", yearClick)
      
      .transition("YearsTransition")
      .duration(tduration)
      
      .attr("width", w / (n + 3))
      .attr("height", function(d) {
          return (d.Count / macCnt) * (h - 96);
        })
      .attr("x", function(d, i) {
        return leftm + (i * w) / n;
        })
      .attr("y", function(d) {
        return h - 36 - (d.Count / macCnt) * (h - 96);
        })
      .attr("fill", function(d, i) {
        var cind = col;
        if (indices.includes(i,0)) {
            cind = 0;
        }
        return colors[cind];
        })
      .attr("class", "yearsBars");
  });
}



function descentClick(d, i) {
  
  if (curScene === lastScene) {
    if (d.Category != curDescent) {
        
        Descents(4, [i]);
        YearsForDescent(d.Category);
      
        curDescent = d.Category;
        curYear = "None";
    } else {
      Descents();
      Years();
      
      curDescent = "None";
      curYear = "None";
    }
  }
}

function yearClick(d, i) {
  if (curScene === lastScene) {
    if (d.Year != curYear) {
      Years(5, [i]);
      DescentForYears(d.Year);
      
      curYear = d.Year;
      curDescent = "None";
      
    } else {
      Descents();
      Years();
      
      curYear = "None";
      curDescent = "None";
    }
  }
}

function Descents(col = 2, indices = [-1]) {
  d3.select("#ch2header")
    .attr("Height", 30)
    .html("Category of Descent");

  d3.csv("descent.csv", function(error, data) {
    if (error) {
      console.log(error);
    }
    
    var right = 10, left = 10;
    var width = parseInt(d3.select("#Category").style("width"), 10),
      width = width - left - right,
      height = 650;

    data.forEach(function(d) {
      d.Category = d.descent;      
      d.Count = +d.count;
    });

    var macCnt = d3.max(data, function(d) {
      return d.Count;
    });

    var canvas = d3
      .select("body")
      .select("#Category")
      .attr("width", width)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.descending(x.Count, y.Count);
    });

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .text(function(d) {
        return d.Category;
      })
      .attr("fill", "black")
      .attr("y", function(d, i) {
        return i * 30 + 15;
        })
      .attr("x", 0)
      .attr("class", "Categories")
      .on("click", descentClick)
      ;
    
    var div = d3.select(".tooltip")
            .style("opacity", 0);
            
    var rects = canvas.selectAll("rect").data(data);
    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", function(d) {
        div.transition("TooltipIn")
            .duration(200)
            .style("opacity", 0.9);
            
        div.html("Descent: " + d.Category + "<br/>" + "Arrests: " + d.Count)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
            if ((curScene === lastScene) & (d.Category != curDescent) ) {
                d3.select(this).attr("fill", colors[3]);
            }
        })
      .on("mouseout", function(d) {
          div.style("opacity", 0);
          if (curScene === lastScene) {
            var cind = -1;            
            if ("None" === curDescent ) {
                cind = 2;                
            }
            if ((curDescent != d.Category) & ("None" != curDescent)) {
              cind = 4;                
            }
            if (cind > 0) {
              d3.select(this)
                .attr("fill", colors[cind])
                .transition("mouseOutYearTransition");
            }
            
          }}  )
      .on("click", descentClick)
      .transition("DescentsTransition")
      .duration(tduration)
      
      .attr("height", 25) 
      .attr("width", function(d) {
        return (d.Count / macCnt) * (width - 145) + 5;
      })
      .attr("x", 130)
      .attr("y", function(d, i) {
        return i * 30;
      })
      .attr("class", "Categories")
      .attr("fill", function(d, i) {
        var cind = col;
        if (indices.includes(i, 0)) {
            cind = 2; 
        } 
        return colors[cind];
      });
      
    
  });
}

function YearsForDescent(categoryFilter, col = 0) {
  d3.select("#ch1header").html("Year Arrest Occurred");
  d3.csv("descent_year.csv", function(err, data) {
    
    data.forEach(function(d) {
      d.Year = +d.year;
      d.Count = +d.count;
      d.Category = d.descent;
    });

    data = data.filter((val, ind, array) => {
      return val.Category === categoryFilter;
    });
    
    var right = 10, left = 10;
    var pw = parseInt(d3.select("#Hours").style("width"), 10),
      width = pw - left - right,
      height = 500; 

    var macCnt = d3.max(data, function(d) {
      return d.Count;
    });

    var n = data.length;

    var canvas = d3
      .select("body")
      .select("#Hours")
      .attr("width", pw)
      .attr("height", height);

    var text = canvas.selectAll("text").data(data);

    text
      .enter()
      .append("text")
      .merge(text)
      .text(function(d) {
        return d.Year;
      })
      .attr("fill", "black")
      .attr("x", function(d, i) {
        return left + (i * width) / n + width / (2 * n);
      })
      .attr("width", width / (n + 3))
      .attr("y", height * 0.98)
      .attr("class", "HoursChart")
      .style("text-anchor", "middle")   
      .style("font-size", "1em")
      ;
    
    canvas.selectAll("rect").data(data);

    var div = d3.select(".tooltip")
            .style("opacity", 0);
    
    var rects = canvas.selectAll(".yearsBars").data(data);
    
    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", function(d) {
        div.transition("TooltipIn")
            .duration(200)
            .style("opacity", .9);
        div.html("Year: " +  d.Year + "<br/>" + "Arrests: " + d.Count)	
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
            
            if ((curScene === lastScene) & (d.Year != curYear)) {
                d3.select(this).attr("fill", colors[1]);
            }
        })
      .on("mouseout", function(d) {
          
          div.style("opacity", 0);
          if ((curScene === lastScene) ) {
            
            var cind = -1;            
            if ("None" === curYear) {
                cind = 0;
            }
            if ((curYear != d.Year) & ("None" != curYear)) {
                cind = 5;
            }
            if (cind > 0) {
               d3.select(this)
                .attr("fill", colors[cind])
                .transition("mouseOutYearTransition");
            }
          }}  )
      .on("click", yearClick)
      
      .transition("YearsTransition")
      .duration(tduration)
      
      .attr("width", width / (n + 3))
      .attr("height", function(d) { return (d.Count / macCnt) * (height - 95);})
      .attr("x", function(d, i) {
        return 10 + (i * width) / n;
      })
      .attr("y", function(d) {
        return height - 35 - (d.Count / macCnt) * (height - 95);
      })
      .attr("class", "yearsBars")
      .attr("fill", colors[col]);
      
    rects.exit().remove();
  });
}

function DescentForYears(yearFilter, col = 2) {
  d3.csv("descent_year.csv", function(err, data) {
    
    var left = 10, right =10;
    var  w = parseInt(d3.select("#Category").style("width"), 10),
      w = w - left- right,
      height = 650;

    data.forEach(function(d) {
      d.Year = +d.year;
      d.Count = +d.count;
      d.Category = d.descent;
    });

    data = data.filter((val, ind, array) => {
      return val.Year === yearFilter;
    });

    var macCnt = d3.max(data, function(d) {
      return d.Count;
    });
    
    
    var canvas = d3
      .select("body")
      .select("#Category")
      .attr("width", w)
      .attr("height", height);

    data.sort(function(x, y) {
      return d3.descending(x.Count, y.Count);
    });

    var text = canvas.selectAll("text").data(data);
    text
      .enter()
      .append("text")
      .merge(text)
      .text(function(d) {
        return d.Category;
      })
      .attr("fill", "black")
      .attr("y", function(d, i) {
        return i * 30 + 15;
      })      
      .attr("x", 0)      
      .on("click", descentClick);
    

    var rects = canvas.selectAll("rect").data(data);

    var div = d3.select(".tooltip")
            .style("opacity", 0);
    rects
      .enter()
      .append("rect")
      .merge(rects)
      .on("mouseover", function(d) {
        div.transition("TooltipIn")
            .duration(200)		
            .style("opacity", .9);
        div.html("Category: " +  d.Category + "<br/>" + "Crimes: " + d.Count)	
            .style("left", (d3.event.pageX + 10) + "px")		
            .style("top", (d3.event.pageY - 50) + "px");
            if (curScene === lastScene) {
              if (d.Category != curDescent) {
                d3.select(this).attr("fill", colors[3]);
              }
            }	
        })
      .on("mouseout", function(d) {
          div.style("opacity", 0);
          if (curScene === lastScene) {
            
            var cind = -1;
            
            if ("None" === curDescent) {
                cind = 2;
              
            }
            if ((curDescent != d.Category) & ("None" != curDescent)) {
                cind = 4;
              
            }
            
            if (cind > 0) {
              d3.select(this)
                .attr("fill", colors[cind])
                .transition("mouseOutYearTransition");
            }
            
          }}  )
      .on("click", descentClick)
      .transition("YeasForDescentTransition")
      .duration(tduration)
      .attr("height", 25)
      .attr("width", function(d) {return (d.Count / macCnt) * (w - 130);})
      .attr("y", function(d, i) {
        return i * 30;
      })
      .attr("x", 130)
      .attr("fill", colors[col]);
    
    canvas.selectAll("text").data(data);
  });
}

function nextScene() {
  scenePicker(curScene + 1);
  progBar();
}

function preScene() {
  scenePicker(curScene - 1);
  progBar();
}

function progBar(percent = curScene / lastScene) {
  
  var canvas = d3.select("body").select("#prog");

  var marg = 10;
  var  w = parseInt(d3.select("#prog").style("width"), 10),
    w = w - marg - marg,
    h = parseInt(d3.select("#prog").style("height"), 10),
    h = h - marg - marg;
  
  var data = [w * percent, w * (1 - percent)], colors = ["#a19494", "#ded7d7"];
  
  var rects = canvas.selectAll("rect").data(data);
  rects
    .enter()
    .append("rect")
    .merge(rects)
    .transition("progBar")
    .duration(800)
    
    .attr("x", function(d, i) {
      return w * percent * i + marg;
    })
    .attr("y", h + marg)
    .attr("width", function(d) {
      return d;
      })
    .attr("height", h)
    .attr("fill", function(d, i) {
      return colors[i];
    });
}

function scenePicker(scene = 0) {
  if (scene <= 0) {
    scene00();
  }
  
  switch(scene) {
    case 1:
      scene11();
      break;
    case 2:
      {
      d3.selectAll(".scene1").remove();
      d3.selectAll(".scene3").remove();
        var width = parseInt(d3.select(".trchart").style("width"), 10);
    
        d3.selectAll("#Hours").attr("width", width * 0.43);
        d3.selectAll(".tdhalfW").attr("width", width * 0.43);
        d3.selectAll(".tdHSpacer").attr("width", width * 0.04);
        d3.selectAll(".ch1tdc").attr("width", width * 0.43);
    
        d3.select(".scrollableDiv").style("overflow-y", "scroll");
        
        Years();
        Descents();
        
      curScene = 2;
       break;
     }
     
    case 3:
      {
      d3.selectAll(".scene4").remove();
      
      Descents(4, [4]);
      YearsForDescent("Other Asian", 0);
      
      // for future use
      (w = parseInt(d3.select("#Hours").style("width"), 10)),
       (h = parseInt(d3.select("#Hours").style("height"), 10));
    
      annotate = ["Some descents like A (Other Asian)", 
              "donot decrease significantly from 2016"]
    
      d3.select("body").select("#Hours").selectAll(".scene3").data(annotate)
        .enter()
        .append("text")
        .text(function(d) {return d})
        .attr("fill", "black")
        .attr("x", w * 0.3)
        .attr("y", function(d, i) { return h * 0.15 + i * 20 ;} )        
        .attr("width", 200)
        .attr("class", "scene3")
        .attr("height", 20)
        .style("font-size", "1em")
        ;
      curScene = 3;
       break;
      }
      
    case 4:
      {
        d3.select("#rightsb").html("›")
        .attr("class", "sideBar");
        d3.selectAll(".scene3").remove();
        
        Descents(4, [0]);
        YearsForDescent("Hispanic/Latin/Mexican", 0);
    
        annotate = ["Other descents, like ",
                "Hispanic/Latin/Mexican,", 
                "decrease significantly",
                "from 2016."];
    
          d3.select("body").select("#Hours").selectAll(".scene4").data(annotate)
            .enter()
            .append("text")
            .text(function(d) {return d})
            .attr("fill", "black")
            .attr("width", 200)
            .attr("x", w * 0.58)
            .attr("y", function(d, i) { return h * 0.6 + i * 20 ;} )
            .attr("class", "scene4")
            .attr("height", 20)
            
            .style("font-size", "1em");
        curScene = 4;
        break;
      }
      
    case 5:
      {
        
        d3.selectAll(".scene4").remove();
        
        d3.select("#rightsb").html("")
            .attr("class", "sideBarNoHover");
        
        Years();
        Descents();
        
        d3.selectAll("text")
            .style("cursor", "pointer");
        d3.selectAll("rect")
            .style("cursor", "pointer");
        curScene = 5;
        break;
      }
  }
  
}

function scene00() {
  curScene = 0;

  d3.select("#leftsb").html("")
    .attr("class", "sideBarNoHover");

  d3.selectAll(".tdhalfW").attr("width", "0");
  d3.selectAll(".tdHSpacer").attr("width", "0");
  d3.selectAll(".ch1tdc").attr("width", "90%");

  d3.select("#ch2header").html("");
  d3.select("#ch1header").attr("colspan", 3);


  //remove Categories
    d3.select("#Category").attr("width", 0);
    d3.select(".scrollableDiv").style("overflow-y", "hidden");
    d3.selectAll(".Categories").remove();

  d3.selectAll(".scene1").remove();

  Years();
  progBar(0);
  
}

function scene11() {
  curScene = 1;
  
  d3.select("#leftsb").html("‹")
    .attr("class", "sideBar")

  //remove Categories
    d3.select("#Category").attr("width", 0);
    d3.select(".scrollableDiv").style("overflow-y", "hidden");
    d3.selectAll(".Categories").remove();
  
  d3.selectAll(".scene0").remove();
  d3.selectAll(".scene2").remove();

  var w = parseInt(d3.select(".trchart").style("width"), 10);

  d3.selectAll(".tdhalfW").attr("width", 0);
  d3.selectAll(".tdHSpacer").attr("width", 0);
  d3.selectAll(".ch1tdc").attr("width", w * 0.9);
  d3.selectAll("#Hours").attr("width", w * 0.9);

  d3.select("#ch2header").html("");

  Years(5, [6]);

  var w = parseInt(d3.select("#Hours").style("width"), 10),
      h = parseInt(d3.select("#Hours").style("height"), 10);

  annotate = ["The total arrest number generally"
        , "decreases (except 2012) from year to year."
        , "It is found that the number decreases"
        , "significantly (around two thirds) from 2016."]

  d3.select("body").select("#Hours").selectAll(".scene1").data(annotate)
    .enter()
    .append("text")
    .text(function(d) {return d})
    .style("font-size", "0.9em")
    
    .attr("fill", "black")
    .attr("x", w * 0.6)
    .attr("y", function(d, i) { return h * 0.5 + i * 20 ;} )
    .attr("width", 200)
    .attr("height", 20)
    .attr("class", "scene1");

}

