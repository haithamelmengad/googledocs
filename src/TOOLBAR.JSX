<Toolbar>
  <IconButton onClick={() => this._onBoldClick()}><BoldIcon /></IconButton>
  <IconButton onClick={() => this._onItalicsClick()}><ItalicIcon /></IconButton>
  <IconButton onClick={() => this._onUnderlineClick()}><UnderlineIcon /></IconButton>
  <IconButton onClick={() => this._onStrikeClick()}><StrikethroughIcon /></IconButton>
  <IconButton onClick={() => this.toggleBulletPoints()}><BulletedListIcon /></IconButton>
  <IconButton onClick={() => this.toggleOrderedList()}><NumberedListIcon /></IconButton>
  <IconMenu
    iconButtonElement={<IconButton><PaintIcon /></IconButton>}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
  >
    <MenuItem primaryText="Blue" onClick={() => this._onBlueClick()} />
    <MenuItem primaryText="Red" onClick={() => this._onRedClick()} />
    <MenuItem primaryText="Yellow" onClick={() => this._onYellowClick()} />
    <MenuItem primaryText="Green" onClick={() => this._onGreenClick()} />
    <MenuItem primaryText="Black" />
  </IconMenu>
  <IconMenu
    iconButtonElement={<IconButton><ColorFillIcon /></IconButton>}
    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
  >
    <MenuItem primaryText="Blue" onClick={() => this._onBlueBackClick()} />
    <MenuItem primaryText="Red" onClick={() => this._onRedBackClick()} />
    <MenuItem primaryText="Yellow" onClick={() => this._onYellowBackClick()} />
    <MenuItem primaryText="Green" onClick={() => this._onGreenBackClick()} />
    <MenuItem primaryText="Black" />
  </IconMenu>
  <IconButton><LeftIcon /></IconButton>
  <IconButton><CenterIcon /></IconButton>
  <IconButton><RightIcon /></IconButton>
</Toolbar>
