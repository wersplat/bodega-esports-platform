cat > entrypoint.py <<'EOF'
#!/usr/bin/env python3
import os, subprocess, time

IMG_DIR  = './toProcess/images'
JSON_DIR = './toProcess/json'

def has_images():
    return any(f.lower().endswith(('.png','.jpg','.jpeg'))
               for f in os.listdir(IMG_DIR))

def has_json():
    return any(f.endswith('_results.json')
               for f in os.listdir(JSON_DIR))

def main():
    while has_images() or has_json():
        if has_images():
            subprocess.run(['python','automate_2k.py'], check=True)
        if has_json():
            subprocess.run(['python','automate_sheet.py'], check=True)
        time.sleep(1)

if __name__=='__main__':
    main()
EOF
chmod +x entrypoint.py
