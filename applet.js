const Applet = imports.ui.applet;
const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;
const Util = imports.misc.util;

function MyApplet(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,
    
    _init: function(orientation, panel_height, instance_id){
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        
        this.set_applet_tooltip(_("Watch a stream"));
        this.set_applet_icon_name("video-x-generic");
        
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);
        
        this.urlEntryField = new St.Entry({name: 'url-entry', 
                                            hint_text: _('Enter a stream URL'),
                                            track_hover: true,
                                            can_focus: true});
        this.menu.addActor(this.urlEntryField);
        
        this.urlEntryField.clutter_text.connect('key-press-event', Lang.bind(this, this._keyPressed));
        this.urlEntryField.connect('key-press-event', Lang.bind(this, this._keyPressed));
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        this.startButton = new PopupMenu.PopupMenuItem("Start Stream");
        this.startButton.connect('activate', Lang.bind(this, this._loadStream));
        this.menu.addMenuItem(this.startButton);
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    },
    
    on_applet_clicked: function(){
        this.menu.toggle();
    },
    
    _loadStream: function(){
        loadStream(this.urlEntryField.get_text(), 'best');
        this.urlEntryField.set_text("");
        this.menu.close();
    },
    
    _keyPressed: function(actor, event){
        if(event.get_key_symbol() == Clutter.KEY_Return && this.menu.isOpen){
            this._loadStream();
        }
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new MyApplet(orientation, panel_height, instance_id);
}

function loadStream(streamUrl, streamQuality){
    Util.spawnCommandLine('livestreamer ' + streamUrl + ' ' + streamQuality);
}