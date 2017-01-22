
class Apps2Update(object):

	def __init__(self):
		self._top_apps = []
		self._bottom_apps = []

	def add_top(self, app):
		if app in self._bottom_apps: return
		if app in self._top_apps: return

		self._top_apps.append(app)

	def add_bottom(self, app):
		if app in self._top_apps: self._top_apps.remove(app)
		if app in self._bottom_apps: return
		
		self._bottom_apps.append(app)

	@property
	def applications(self): return self._top_apps+self._bottom_apps