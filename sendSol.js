//sendSol.js
const web3 = require("@solana/web3.js");
const { DateTime, Interval } = require("luxon");
const {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} = require("@solana/web3.js");
const spl = require("@solana/spl-token");
// DEVNET
const PROGRAM_ID = "9kJt4LPtpxU89UzLo3FxaGbd49Cgvkn5Y2rAhvK1ZJc5";

// MAINNET
// const PROGRAM_ID = 'updg8JyjrmFE2h3d71p71zRXDR8q4C6Up8dDoeq3LTM'

// // TEST-VALIDATOR
// const PROGRAM_ID = 'updg8JyjrmFE2h3d71p71zRXDR8q4C6Up8dDoeq3LTM'

const {
  Program,
  Provider,
  BN,
  AnchorProvider,
} = require("@project-serum/anchor");
const anchor = require("@project-serum/anchor");

const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");

// FILESYSTEM
const keypairArray = require("/Users/chesterking/.config/solana/id.json");

let idl = require("./src/contracts/programIDL.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const web3 = require("@solana/web3.js");

  let ar = keypairArray;
  const firstHalf = ar.slice(0, 32);

  // Generate a new random public key
  const wallet = web3.Keypair.fromSeed(new Uint8Array(firstHalf));

  //   Connect to cluster

  // DEVNET
  const connection = new web3.Connection(
    "https://solana-devnet.g.alchemy.com/v2/rupoQdP82X4Z4zmE8tzOYIgj9SIOHBfK",
    "processed"
  );

  // MAINNET
  // const connection = new web3.Connection(
  //   "https://solana-mainnet.g.alchemy.com/v2/AfkKwKG0kgbrgihdol2B6xxYCUi_2CWh",
  //   'confirmed',
  // );

  // // LocalTESTValidator
  // const connection = new web3.Connection(
  //     "http://127.0.0.1:8899",
  //     'confirmed',
  // );

  console.log("Connected to cluster:", connection._rpcEndpoint);

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  await console.log("Signer Wallet in Play");
  await console.log(wallet.publicKey.toString());

  const program = new Program(idl, PROGRAM_ID, provider);

  console.log("Wallet in Play - ", wallet.publicKey.toString());

  const second_wallet = anchor.web3.Keypair.generate();

  let usdcKey;
  let usdc_ata;
  let second_wallet_usdc_ata;
  let choice_one_ata;
  let choice_two_ata;

  let markid = "134";

  // New keypair to create a project token
  usdcKey = anchor.web3.Keypair.generate();

  const [ownerAddress, ownerBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("ownership")],
    program.programId
  );

  const [adminAddress, adminBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("admin"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [vaultAddress, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("usdc-vault"), Buffer.from(markid)],
    program.programId
  );

  const [secondvaultAddress, secondvaultBump] =
    PublicKey.findProgramAddressSync(
      [Buffer.from("usdc-vault"), Buffer.from("2")],
      program.programId
    );

  const [userStateAddress, userStateBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("user_share"),
      Buffer.from(markid),
      wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [secondUserStateAddress, secondUserStateBump] =
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_share"),
        Buffer.from(markid),
        second_wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

  const [eventAccount, eventBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("event"), Buffer.from(markid)],
    program.programId
  );

  const [secondeventAccount, secondeventBump] =
    PublicKey.findProgramAddressSync(
      [Buffer.from("event"), Buffer.from("2")],
      program.programId
    );

  const [vaultOne, vaultOneBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("event-1-vault"),
      Buffer.from(markid),
      usdcKey.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [vaultTwo, vaultTwoBump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("event-2-vault"),
      Buffer.from(markid),
      usdcKey.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [choiceOneMint, choiceOneMintBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("event-1"), Buffer.from(markid), usdcKey.publicKey.toBuffer()],
    program.programId
  );

  const [choiceTwoMint, choiceTwoMintBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("event-2"), Buffer.from(markid), usdcKey.publicKey.toBuffer()],
    program.programId
  );

  // Deterministically finding out the project token's ATA owned by provider.wallet
  usdc_ata = await spl.getAssociatedTokenAddress(
    usdcKey.publicKey,
    provider.wallet.publicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  second_wallet_usdc_ata = await spl.getAssociatedTokenAddress(
    usdcKey.publicKey,
    second_wallet.publicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // choice ata
  choice_one_ata = await spl.getAssociatedTokenAddress(
    choiceOneMint,
    provider.wallet.publicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );
  // choice ata
  choice_two_ata = await spl.getAssociatedTokenAddress(
    choiceTwoMint,
    provider.wallet.publicKey,
    false,
    spl.TOKEN_PROGRAM_ID,
    spl.ASSOCIATED_TOKEN_PROGRAM_ID
  );

  // Creating transaction to Initialize usdcKey keypair as a token and then minting tokens to  ATA owned by provider.wallet

  let create_mint_tx = new Transaction()
    .add(
      // create mint account
      SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: usdcKey.publicKey,
        space: spl.MintLayout.span,
        lamports: await spl.getMinimumBalanceForRentExemptMint(
          program.provider.connection
        ),
        programId: spl.TOKEN_PROGRAM_ID,
      }),
      // init mint account
      spl.createInitializeMintInstruction(
        usdcKey.publicKey,
        6,
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        spl.TOKEN_PROGRAM_ID
      )
    )
    .add(
      spl.createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        usdc_ata,
        provider.wallet.publicKey,
        usdcKey.publicKey,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )
    .add(
      spl.createAssociatedTokenAccountInstruction(
        provider.wallet.publicKey,
        second_wallet_usdc_ata,
        second_wallet.publicKey,
        usdcKey.publicKey,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )
    .add(
      spl.createMintToInstruction(
        // always TOKEN_PROGRAM_ID
        usdcKey.publicKey, // mint
        usdc_ata, // receiver (should be a token account)
        provider.wallet.publicKey, // mint authority
        47402004034546,
        [], // only multisig account will use. leave it empty now.
        spl.TOKEN_PROGRAM_ID // amount. if your decimals is 8, you mint 10^8 for 1 token.
      )
    )
    .add(
      spl.createMintToInstruction(
        // always TOKEN_PROGRAM_ID
        usdcKey.publicKey, // mint
        second_wallet_usdc_ata, // receiver (should be a token account)
        provider.wallet.publicKey, // mint authority
        47402004034546,
        [], // only multisig account will use. leave it empty now.
        spl.TOKEN_PROGRAM_ID // amount. if your decimals is 8, you mint 10^8 for 1 token.
      )
    );
  // .add(
  //   SystemProgram.transfer(
  //     {
  //       fromPubkey: wallet.publicKey,
  //       lamports: 10000000000000,
  //       toPubkey: second_wallet.publicKey
  //     }
  //   )
  // );

  const expiresAt = DateTime.now().plus({ days: 1 });
  let ixcm = await program.methods
    .createMarket(
      markid,
      new BN(expiresAt.toUnixInteger()),
      1,
      "",
      "=",
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      0.0,
      4,
      1.0
    )
    .accounts({
      authority: wallet.publicKey,
      adminAccount: adminAddress,
      systemProgram: SystemProgram.programId,
      createMarket: eventAccount,
      tokenMint: usdcKey.publicKey,
      vaultUsdc: vaultAddress,
    })
    .instruction();

  create_mint_tx.add(ixcm);

  let ixal = await program.methods
    .adminAddLiquidity(markid, vaultBump, new anchor.BN(1000000000))
    .accounts({
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      marketAccount: eventAccount,
      userMarketShare: userStateAddress,
      tokenMint: usdcKey.publicKey,
      vaultUsdc: vaultAddress,
      tokenAta: usdc_ata,
      adminAccount: adminAddress,
    })
    .instruction();

  create_mint_tx.add(ixal);

  let signature = await web3.sendAndConfirmTransaction(
    connection,
    create_mint_tx,
    [wallet, usdcKey] // this is signers
  );
  console.log("SIGNATURE", signature);
  console.log("USDC mint address", usdcKey.publicKey.toBase58());
  //   console.log("Sponsor USDC balance", await program.provider.connection.getTokenAccountBalance(usdc_ata));

  console.log("-----------------------------");

  // const marketData = await program.account.marketEvent.fetch(
  //   eventAccount
  // );

  // });

  await console.log("Done");
})();
