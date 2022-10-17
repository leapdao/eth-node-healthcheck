
#!/bin/bash

sudo su -

curl https://raw.githubusercontent.com/isman-usoh/bkc-node-healthcheck/master/bin/bkc-node-healthcheck-linux-x64 --output /usr/bin/bkc-node-healthcheck-linux-x64
curl https://raw.githubusercontent.com/isman-usoh/bkc-node-healthcheck/master/services/eth-node-healthcheck.service --output /etc/systemd/system/bkc-node-healthcheck.service
chmod +x /usr/bin/bkc-node-healthcheck-linux-x64

systemctl daemon-reload
systemctl enable bkc-node-healthcheck.service
systemctl start bkc-node-healthcheck.service
systemctl status bkc-node-healthcheck.service
