"""This is an ABACUS plugin.
    request = {
    "action": "design" or "singleMutationScan"
    "id": user_id
    "inpath": inputFilePath
    "filename": filename
    "amount": amount #optional
    "tag":tag
    "design": desginpath
    "mutationScan": scanpath
    "abacuspath": path
    }
"""
from time import ctime
from subprocess import Popen
from os import mkdir, listdir, getcwd, chdir, path
import os
from shutil import rmtree
from plugin import Plugin
from zipfile import ZipFile
import re

from .callabacus import InternalError, FileFormatError

abacuspath = 'plugins/ABACUS/ABACUS/bin/'
designpath = 'plugins/ABACUS/design.py'
mutationpath = 'plugins/ABACUS/singleMutationScan.py'


class ABACUS(Plugin):
    name = 'ABACUS'

    def process(self, request):
        print("ABACUS plugin got a request:" + str(request))
        if not path.exists(abacuspath):
            return dict(status="Empty")

        filepath = abacuspath + 'pdbs/' + str(self.user.id) + '/'

        if request["action"] == "design":
            print("Cleaning!")
            try:
                rmtree(filepath)  # Alert! Clean directory even it is existed
            except:
                pass
            mkdir(filepath)

            if request['demo'] == "True":
                print("demo!")
                Popen(['python3', designpath, filepath, str(self.user.id) + '.pdb',
                       request['amount'], abacuspath, request['demo']])
                return dict(status="Running", demo="True")

            print('Gonna save file')
            request['file'].save(filepath + str(self.user.id) + '.pdb')
            print("File saved")

            try:
                tag = request["tag"]
            except KeyError:
                Popen(['python3', designpath, filepath, str(self.user.id) + '.pdb',
                        request['amount'], abacuspath, request['demo']])
            else:
                Popen(['python3', designpath, filepath, str(self.user.id) + '.pdb',
                       request['amount'], abacuspath, request['demo'], tag])
            return dict(status="Running")

        elif request["action"] == 'getstatus':
            if not path.exists(filepath):
                return dict(status='Clean')

            ferr = open(filepath + 'err.log', 'r')
            f = open(filepath + 'status.log', 'r')
            flag = False

            while 1:
                log = ferr.read(9600)
                if log.find('Exception') != -1:
                    return dict(status='Failed', reason=log)
                if not log:
                    break

            while 1:
                log = f.read(9600)
                if log.find('Done') != -1:
                    flag = True
                    break
                elif log.find('Error') != -1:
                    return dict(status='Failed', reason=log)
                if not log:
                    break
            # Compress file
            if flag:
                cur_path = getcwd()
                if not path.exists('app/static/downloads'):
                    mkdir('app/static/downloads')

                target = ZipFile('app/static/downloads/' + str(self.user.id) + '.zip', 'w')
                allfile = listdir(filepath)
                chdir(filepath)
                for file in allfile:
                    if re.match(r'.*_design_.*\.pdb', file) or re.match(r'.*_design_.*\.fasta', file):
                        target.write(file)
                target.close()
                chdir(cur_path)
                return dict(url='/static/downloads/' + str(self.user.id) + '.zip', status='Success')
            else:
                return dict(status='Running')
        else:
            return {"success": False, "reason": "unknown action: " + request["action"]}


__plugin__ = ABACUS()
