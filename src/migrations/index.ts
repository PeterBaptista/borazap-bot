import * as migration_20250901_034516 from './20250901_034516';
import * as migration_20250902_230644 from './20250902_230644';
import * as migration_20250902_232817 from './20250902_232817';
import * as migration_20250903_223813 from './20250903_223813';
import * as migration_20250904_214104 from './20250904_214104';
import * as migration_20250904_225908 from './20250904_225908';

export const migrations = [
  {
    up: migration_20250901_034516.up,
    down: migration_20250901_034516.down,
    name: '20250901_034516',
  },
  {
    up: migration_20250902_230644.up,
    down: migration_20250902_230644.down,
    name: '20250902_230644',
  },
  {
    up: migration_20250902_232817.up,
    down: migration_20250902_232817.down,
    name: '20250902_232817',
  },
  {
    up: migration_20250903_223813.up,
    down: migration_20250903_223813.down,
    name: '20250903_223813',
  },
  {
    up: migration_20250904_214104.up,
    down: migration_20250904_214104.down,
    name: '20250904_214104',
  },
  {
    up: migration_20250904_225908.up,
    down: migration_20250904_225908.down,
    name: '20250904_225908'
  },
];
