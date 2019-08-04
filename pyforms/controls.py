from confapp import conf

try:

    if conf.PYFORMS_MODE in ['GUI']:

        from pyforms_gui.allcontrols import *

    elif conf.PYFORMS_MODE in ['TERMINAL']:

        from pyforms_terminal.allcontrols import *

    elif conf.PYFORMS_MODE in ['WEB']:

        from pyforms_web.allcontrols import *

except:

    from pyforms_web.allcontrols import *
