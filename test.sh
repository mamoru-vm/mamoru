#!/usr/bin/env bash

#testing now done with chimp
# chimp --ddp=http://localhost:3000 --watch --path=tests/cucumber
# optional --browser=chrome #default, or firefox, phantomjs, safari

# Startup Chimp testing instance
MONGO_PORT=3001
METEOR_PORT=3100

# test environment variables
export IS_MIRROR=true
export MONGO_URL="mongodb://localhost:$MONGO_PORT/chimp_db"

cd mamoru/
echo After METEOR IS READY, run: chimp --path=tests \
     --ddp=http://localhost:$METEOR_PORT --watch


meteor --settings settings.json --port $METEOR_PORT

