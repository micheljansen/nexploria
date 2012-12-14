var is_transforming = false;
var last_rotation = 0;
var drag_in_progress = false;

var category_axis = "price";
var dimension_axis = "num_beds";
var invert_category = false;
var invert_dimension = false;

request_update();

var $sw = $('#content'),
    $output = $('#output');

$ca = $("#category_axis");
    /*
$sw.on('hold tap swipe doubletap transformstart transform transformend dragstart drag dragend swipe release', function (event) {
    //event.preventDefault();

    $output.prepend("Type: " + event.type + ", Fingers: " + event.touches.length + ", Direction: " + event.direction + "<br/>");
    console.log(event);
});
*/

///////////////////////////
// transpose interaction //
///////////////////////////

$sw.on('transform', function (event) {
  is_transforming = true;
  $output.prepend("rotation: "+ event.rotation +"<br/>");
  console.log(event);
  last_rotation = event.rotation;
  $sw.css("-webkit-transform", "rotateZ("+event.rotation+"deg)");
});

$sw.on('transformstart', function(event) {
  event.preventDefault();
  is_transforming = true;
  $output.prepend("transformstart"+"<br/>");
  console.log(event);
  $sw.removeClass("not-transposed transposed-left transposed-right");
});

$sw.on('transformend touchend', function(event) {
  if(!is_transforming) {
    return;
  }
  is_transforming = false;
  $output.prepend("transformend"+"<br/>");
  console.log(event);

  if(last_rotation < -30 && last_rotation >= -180) {
    $sw.addClass("transposed-left");
    $output.prepend("left"+"<br/>");
    var temp = category_axis;
    category_axis = dimension_axis;
    dimension_axis = temp;

    var current_invert_dimension = invert_dimension
    // rotating left inverts the order of the new dimension
    invert_dimension = !invert_category;
    // but the order of the new category is preserved
    invert_category = current_invert_dimension;
    update_data();
  }
  else if(last_rotation > 30 || last_rotation < -180) {
    $sw.addClass("transposed-right");
    $output.prepend("right"+"<br/>");
    var temp = category_axis;
    category_axis = dimension_axis;
    dimension_axis = temp;

    var current_invert_dimension = invert_dimension
    // rotating right preserves order from category to dimension
    invert_dimension = invert_category;
    // but going from dimension to category inverts its order
    invert_category = !current_invert_dimension;
    update_data();
  }
  else {
    $sw.addClass("not-transposed");
    $output.prepend("abort"+"<br/>");
  }
  $sw.css("-webkit-transform", '');
});


///////////////////////////
// flip axis interaction //
///////////////////////////

// allow both the axis and the header to be used to initiate gestures
$cia = $("#category_axis, #category_header_container");

$cia.on('touchmove', function(event) {
  // prevent scrolling while transforming
  event.preventDefault();
});

$cia.on('drag', function(event) {
  if(event.direction == "down") {
    var dY = event.distanceY;
    console.log(dY);
    $sw.css("-webkit-transform", "rotateX("+dY+"deg)");
  }
});

$cia.on('dragend', function(event) {
  $sw.css("-webkit-transform", "");
});


// update the header location after scrolling
$cht = $("#category_header_container");
$data = $("#data");

var scroll_timer;

$data.on("touchmove scroll", function() {
  $cht.css("left", -$data.scrollLeft());
});

function sync_header_scroll() {
}

function header_syncing() {
  return typeof scroll_timer === "undefined";
}




// this is how you unbind an event
/*$sw.on('swipe', function (event) {
    event.preventDefault();

    $sw.off('tap');
});*/

function update_data() {
  request_update();
  $sw.fadeOut(500, function() {
    $sw.removeClass("not-transposed transposed-left transposed-right");
  });
}

function set_data(response) {
  var data = response.data;
  console.log(data);

  $ca = $("#category_headers");
  $ca.html("");

  $columns = $("#columns");
  $columns.html("");

  $("#category_title").html(category_axis);
  $("#dimension_title").html(dimension_axis);

  _(data).each(function(cat) {
    $ca.append("<div class='cat'>"+cat.category_bucket+"</div>");
    $column = $("<div class='col'></div>");
    $columns.append($column);

    _(cat.listings).each(function(listing) {
      $column.append("<div class='listing' data-url='"+listing.site_url+"' data-title='"+listing.title+"'>"+
        "<div class='img-wrapper'>"+
        "<img src='"+listing.image_url+"'/>"+
        "<span class='price'>"+listing.price+"</span>"+
        "</div>"+
        "<h2>"+listing.title+"</h2>"+
        "</div>"
      )
    });
    $(".listing").each(function(idx,listing) {
        $(listing).click(function(){
            spark($(this).data("url"), $(this).data("title"));
        });
    });
  });

  // manually set width so floats fit
  $columns.css("width", data.length*200+"px");

  $sw.fadeIn();
}

function request_update() {

  console.log("request_update", category_axis, invert_category, dimension_axis, invert_dimension);
  $.getJSON("http://10.10.10.27:1234/hack_data?country=uk&geoid=city_birmingham"
  +"&category="+category_axis
  +"&dimension="+dimension_axis
  +"&reverse="+(invert_dimension ? 1 : 0)
  +"&reverse_category="+(invert_category ? 1 : 0)
  +"&max_bucketsize=25"
  , set_data)
  // $.getJSON("test.json", set_data);
}


