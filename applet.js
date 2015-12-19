const Applet = imports.ui.applet;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

function MyApplet(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,
    
    _init: function(orientation, panel_height, instance_id){
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        
        this.set_applet_tooltip(_("Watch a stream"));
        this.set_applet_icon_name("exit");
        
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);
        
        this.urlEntryArea = new St.Entry({name: 'url-entry', 
                                            hint_text: _('Enter a stream URL'),
                                            track_hover: true,
                                            can_focus: true});
        this.menu.addActor(this.urlEntryArea);
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addAction(_("Watch URL"), function(event) {
            Util.spawnCommandLine('livestreamer ' + this.urlEntryArea.get_text());
        });
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addAction(_("Watch Summit1g"), function(event) {
            loadStream('twitch.tv/summit1g', 'best');
        });
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addAction(_("Watch JoshOG"), function(event) {
            loadStream('twitch.tv/joshog', 'best');
        });
    },
    
    on_applet_clicked: function(){
        this.menu.toggle();
    },
};

function main(metadata, orientation, panel_height, instance_id) {
    return new MyApplet(orientation, panel_height, instance_id);
}

function loadStream(streamUrl, streamQuality){
    Util.spawnCommandLine('livestreamer ' + streamUrl + ' ' + streamQuality);
}