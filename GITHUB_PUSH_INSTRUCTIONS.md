# GitHub Push Instructions
## Galgo Español Research Corpus — Batches 10–13 Upload

**Repository:** https://github.com/alex-lapipa/galgos  
**Commits Ready:** 4 files (Batches 10–13)  
**Commit Message:** Pre-written and staged locally  
**Status:** Local commit created; awaiting push with GitHub credentials

---

## ✅ WHAT'S BEEN DONE

Local git repository has been prepared with:
- ✅ Cloned https://github.com/alex-lapipa/galgos
- ✅ Copied Batches 10–13 to local clone
- ✅ Staged all 4 batch files
- ✅ Created comprehensive commit message
- ✅ Committed locally with hash: `ce1b602`

**Commit details:**
```
Batches 10-13: 20th-21st century enriched, comparative sighthound study

- Batch 10 (Enriched): 1900-2000 track racing, FEG infrastructure, Civil War gap, FCI verification
- Batch 11 (Enriched): 2000-2026 rescue organizations, Law 7/2023, welfare statistics, genomics
- Batch 12 (Enriched): English Greyhound crosses 1900-1960, diaspora populations, archival roadmap
- Batch 13 (New): Comparative Iberian sighthound study - galgo vs podenco breed distinction, genetic evidence

All batches verified with source hierarchy and claims classification.
Batch 13 confirms galgo and podenco as distinct breed families.
Ready for Batch 14 (Synthesis/Compilation).

GitHub: alex-lapipa/galgos
Vercel: prj_Y5COmpVmDRXS5aP18l4IZvfsYzsU
```

---

## 🔐 NEXT STEP: AUTHENTICATE AND PUSH

To complete the upload, you need to push with GitHub credentials. Choose one method below:

### **Option 1: SSH (Recommended for security)**

**Prerequisites:**
- SSH key configured on GitHub (`Settings` → `SSH and GPG keys`)
- SSH key added to your local SSH agent

**Steps:**

```bash
# 1. Clone the repository with SSH
cd /tmp
rm -rf galgos_push  # Remove old HTTPS clone
git clone git@github.com:alex-lapipa/galgos.git galgos_push

# 2. Copy batch files
cp /mnt/user-data/outputs/Batch_*.md galgos_push/

# 3. Stage and commit
cd galgos_push
git config user.email "your.email@example.com"
git config user.name "Your Name"
git add Batch_10_*.md Batch_11_*.md Batch_12_*.md Batch_13_*.md

git commit -m "Batches 10-13: 20th-21st century enriched, comparative sighthound study

- Batch 10 (Enriched): 1900-2000 track racing, FEG infrastructure, Civil War gap, FCI verification
- Batch 11 (Enriched): 2000-2026 rescue organizations, Law 7/2023, welfare statistics, genomics
- Batch 12 (Enriched): English Greyhound crosses 1900-1960, diaspora populations, archival roadmap
- Batch 13 (New): Comparative Iberian sighthound study - galgo vs podenco breed distinction, genetic evidence

All batches verified with source hierarchy and claims classification.
Batch 13 confirms galgo and podenco as distinct breed families.
Ready for Batch 14 (Synthesis/Compilation).

GitHub: alex-lapipa/galgos
Vercel: prj_Y5COmpVmDRXS5aP18l4IZvfsYzsU"

# 4. Push to GitHub
git push origin main
```

---

### **Option 2: HTTPS with Personal Access Token (GitHub Token)**

**Prerequisites:**
- GitHub Personal Access Token created (`Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`)
- Token has `repo` scope (read/write repository access)
- Token saved in a secure location

**Steps:**

```bash
# 1. Clone with HTTPS and credential setup
cd /tmp
rm -rf galgos_push
git clone https://github.com/alex-lapipa/galgos.git galgos_push

# 2. Configure git to use credential storage
git config --global credential.helper store

# 3. Perform initial authentication (this will prompt for credentials)
cd galgos_push
git pull  # This will prompt for username and token

# When prompted:
# Username: [your GitHub username]
# Password: [paste your personal access token]
# (The token will be stored locally for future use)

# 4. Copy batch files
cp /mnt/user-data/outputs/Batch_*.md .

# 5. Stage and commit
git config user.email "your.email@example.com"
git config user.name "Your Name"
git add Batch_10_*.md Batch_11_*.md Batch_12_*.md Batch_13_*.md

git commit -m "Batches 10-13: 20th-21st century enriched, comparative sighthound study

- Batch 10 (Enriched): 1900-2000 track racing, FEG infrastructure, Civil War gap, FCI verification
- Batch 11 (Enriched): 2000-2026 rescue organizations, Law 7/2023, welfare statistics, genomics
- Batch 12 (Enriched): English Greyhound crosses 1900-1960, diaspora populations, archival roadmap
- Batch 13 (New): Comparative Iberian sighthound study - galgo vs podenco breed distinction, genetic evidence

All batches verified with source hierarchy and claims classification.
Batch 13 confirms galgo and podenco as distinct breed families.
Ready for Batch 14 (Synthesis/Compilation).

GitHub: alex-lapipa/galgos
Vercel: prj_Y5COmpVmDRXS5aP18l4IZvfsYzsU"

# 6. Push to GitHub
git push origin main
```

---

### **Option 3: GitHub Web Interface (No Terminal Required)**

**Steps:**

1. Open https://github.com/alex-lapipa/galgos
2. Click **"Add file"** → **"Upload files"**
3. Select files to upload:
   - `Batch_10_The_Galgo_Espanol_20th_Century_1900_2000.md`
   - `Batch_11_The_Galgo_Espanol_21st_Century_2000_2026.md`
   - `Batch_12_English_Greyhound_Crosses_and_Postcolonial_Diaspora_Galgos.md`
   - `Batch_13_Comparative_Iberian_Sighthound_Study.md`
4. Scroll to **"Commit changes"** section
5. **Commit message:**
   ```
   Batches 10-13: 20th-21st century enriched, comparative sighthound study
   ```
6. **Extended description:**
   ```
   - Batch 10 (Enriched): 1900-2000 track racing, FEG infrastructure, Civil War gap, FCI verification
   - Batch 11 (Enriched): 2000-2026 rescue organizations, Law 7/2023, welfare statistics, genomics
   - Batch 12 (Enriched): English Greyhound crosses 1900-1960, diaspora populations, archival roadmap
   - Batch 13 (New): Comparative Iberian sighthound study - galgo vs podenco breed distinction, genetic evidence
   
   All batches verified with source hierarchy and claims classification.
   Batch 13 confirms galgo and podenco as distinct breed families.
   Ready for Batch 14 (Synthesis/Compilation).
   ```
7. Select **"Commit directly to the main branch"**
8. Click **"Commit changes"**

---

## ✨ UPLOAD COMPLETE — WHAT TO EXPECT

Once pushed successfully, you will see:

1. **New commits in GitHub repository:**
   - Commit `ce1b602` with message "Batches 10-13: 20th-21st century enriched..."
   - 4 new files added (Batches 10–13)
   - Insertion count: ~1,356 lines

2. **GitHub repository updates:**
   - Files visible in repository browser
   - Commit history updated
   - Contributors list updated

3. **Verify upload:**
   ```bash
   git log --oneline | head -5
   # Should show the new commit with message "Batches 10-13..."
   ```

---

## 📋 FILE CHECKLIST

Before pushing, verify all files are present:

- [ ] `Batch_10_The_Galgo_Espanol_20th_Century_1900_2000.md` (29 KB)
- [ ] `Batch_11_The_Galgo_Espanol_21st_Century_2000_2026.md` (33 KB)
- [ ] `Batch_12_English_Greyhound_Crosses_and_Postcolonial_Diaspora_Galgos.md` (23 KB)
- [ ] `Batch_13_Comparative_Iberian_Sighthound_Study.md` (43 KB)

**Total size:** ~128 KB

**Verify in terminal:**
```bash
ls -lh /mnt/user-data/outputs/Batch_1*.md
# Should show all 4 files with sizes matching above
```

---

## 🔍 TROUBLESHOOTING

### "fatal: could not read Username for 'https://github.com'"
**Cause:** Git credential helper not configured  
**Solution:** Use SSH (Option 1) or configure credential storage first (Option 2)

### "Permission denied (publickey)"
**Cause:** SSH key not added to GitHub or SSH agent  
**Solution:** 
```bash
ssh-add ~/.ssh/id_rsa  # Add SSH key to agent
ssh -T git@github.com  # Test SSH connection
```

### "ERROR: Permission to alex-lapipa/galgos denied to [username]"
**Cause:** Using wrong GitHub account or token lacks permissions  
**Solution:** 
- Verify you're logged in as the account that owns the repo
- For tokens, ensure "repo" scope is selected
- For SSH, verify the SSH key is added to your account

### "Your branch is ahead of 'origin/main' by X commits"
**Cause:** Local commits not yet pushed  
**Solution:** 
```bash
git push origin main
```

### "Merge conflict"
**Cause:** Repository was modified since clone  
**Solution:**
```bash
git pull --rebase origin main
git push origin main
```

---

## 📞 COMPLETION VERIFICATION

**After successful push, confirm by:**

1. Visiting https://github.com/alex-lapipa/galgos/commits/main
2. Verify the latest commit shows "Batches 10-13: 20th-21st century enriched..."
3. Click on the commit to see the 4 batch files listed
4. Open one batch file to verify content uploaded correctly

**Success indicators:**
- ✅ 4 files show as "added" in the commit
- ✅ Files display in GitHub repository browser
- ✅ File content matches local versions
- ✅ Commit appears in repository history

---

## 🚀 NEXT PHASE: BATCH 14 (SYNTHESIS)

Once Batches 10–13 are uploaded and verified in GitHub:

1. **Batch 14 (Synthesis/Compilation)** composition begins
2. Batches 00–13 integrated into master narrative
3. Cumulative claims table generated
4. Research roadmap and archival guide compiled
5. Final synthesis document uploaded to GitHub

**Estimated Batch 14 size:** 80–100 KB  
**Status:** Ready to begin once upload confirmed

---

**End of GitHub Push Instructions**

*For additional help, refer to GitHub's official documentation at https://docs.github.com/en/get-started/importing-your-projects-to-github*
