/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("repository.created", async (context) => {
    const {owner,repo} = context.repo();
    const branch = context.payload.repository.default_branch;
    app.log.info("A new repo has been created!!");
    
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
    })


  });


  app.on("create", async (context) => {
    const {owner,repo} = context.repo();
    const branch = context.payload.ref;
    const ref_type = context.payload.ref_type;
    app.log.info("branch created!!");
    if(ref_type==="branch"){
      if(branch.toLowerCase()==="release" || branch.toLowerCase()==="dev"){
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
  }}
  } );
};
