/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {

  async function createBranchRule(context,owner,repo,branch){
    await context.octokit.repos.updateBranchProtection({
      owner,
      repo,
      branch,
      required_status_checks: null,
      enforce_admins: false,
      required_pull_request_reviews: {
        require_code_owner_reviews: true,
        required_approving_review_count: 3
      },
      restrictions: null,
      require_linear_history: true,
      allow_deletions: true,
      required_conversation_resolution: true
    });
  }

  // Your code here
    app.on("create", async (context) => {
    const {owner,repo} = context.repo();
    const branch = context.payload.ref;
    const ref_type = context.payload.ref_type;
    app.log.info(branch+" branch created!!");
    app.log.info("Creating branch protection rule for "+branch);
    if(ref_type==="branch"){
      if(branch.toLowerCase()==="release"){
        createBranchRule(context,owner,repo,branch);
        app.log.info("Branch protection rule for "+branch+" branch has been created.");
      }
    else if (branch.toLowerCase()==="dev"){
      createBranchRule(context,owner,repo,branch);
      app.log.info("Branch protection rule for "+branch+" branch has been created.");

      createBranchRule(context,owner,repo,"main");
      app.log.info("Branch protection rule for master branch has been created.");
      }
    }

  });

};



