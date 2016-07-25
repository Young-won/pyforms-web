

function ControlWorkflow(name, properties){
	ControlBase.call(this, name, properties);
};
ControlWorkflow.prototype = Object.create(ControlBase.prototype);

////////////////////////////////////////////////////////////////////////////////

ControlWorkflow.prototype.init_control = function(){
	var html = "<div id='"+this.place_id()+"' class='field ControlWorkflow ui segment' ><label>"+this.properties.label+"</label><div id='"+this.control_id()+"' ></div></div>";
	this.jquery_place().replaceWith(html);

	var self = this;
	this.jquery().change(function(){
		self.basewidget.fire_event( self.name, 'changed' );
	});

	if(!this.properties.visible) this.hide();


	this.set_value(this.properties.value);
};

////////////////////////////////////////////////////////////////////////////////

ControlWorkflow.prototype.set_value = function(value){
	$( '#'+this.control_id() ).flowchart({ data: value, multipleLinksOnOutput:true });
};

////////////////////////////////////////////////////////////////////////////////

ControlWorkflow.prototype.get_value = function(){ 
	return this.properties.value;
};

////////////////////////////////////////////////////////////////////////////////