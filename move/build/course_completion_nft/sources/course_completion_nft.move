module course_platform::course_completion_nft {
    use std::string::{Self, String};
    use aptos_framework::object::{Self, Object};
    use std::option::{Self };
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use std::signer;  


    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EMINTING_DISABLED: u64 = 2;
    const EINSUFFICIENT_BALANCE: u64 = 3;
    const COLLECTION_NOT_INITIALIZED: u64 = 4;
    const EALREADY_INITIALIZED:u64 = 5;

    // Structs
   struct CourseCompletionNFTCollection has key {
    collection_object: Object<collection::Collection>,
    collection_name: String,
    minting_enabled: bool,
    mint_fee: u64,
    fee_recipient: address
    }

    struct ModuleData has key {
    admin: address,
}


  #[event]
struct NFTMintedEvent has drop, store {
    user_address: address,
    course_id: String,
    course_name: String,
    token_id: Object<token::Token>,
    token_name: String,
    token_uri: String,
    completion_date: u64,
    mint_fee: u64,
}

fun init_module(resource_account: &signer) {
    move_to(resource_account, ModuleData {
        admin: @course_platform, // Set the initial admin
    });
}

public entry fun create_collection(admin: &signer) acquires ModuleData {
    let admin_addr = signer::address_of(admin);
    
    assert!(!exists<CourseCompletionNFTCollection>(admin_addr), EALREADY_INITIALIZED);
    
    let module_data = borrow_global_mut<ModuleData>(@course_platform);
    module_data.admin = admin_addr;
    
    let collection_name = string::utf8(b"Course Completion Certificates");
    let description = string::utf8(b"NFTs for completed courses");
    let uri = string::utf8(b"https://example.com/course-certificates/");

    let collection_constructor_ref = collection::create_unlimited_collection(
        admin,
        description,
        collection_name,
        option::none(),
        uri
    );

    let collection_object = object::object_from_constructor_ref<collection::Collection>(&collection_constructor_ref);

    move_to(admin, CourseCompletionNFTCollection {
        collection_object,
        collection_name,
        minting_enabled: true,
        mint_fee: 0,
        fee_recipient: admin_addr,
    });
}


  public entry fun mint_nft(
    user: &signer,
    course_id: String,
    course_name: String
) acquires CourseCompletionNFTCollection {
    let user_addr = signer::address_of(user);
    
    // Check if the collection has been initialized
    assert!(exists<CourseCompletionNFTCollection>(@course_platform), COLLECTION_NOT_INITIALIZED);
    let nft_collection = borrow_global_mut<CourseCompletionNFTCollection>(@course_platform);

    // Check if minting is enabled
    assert!(nft_collection.minting_enabled, EMINTING_DISABLED);

    // Handle minting fee
    let mint_fee = nft_collection.mint_fee;
    if (mint_fee > 0) {
        assert!(
            coin::balance<AptosCoin>(user_addr) >= mint_fee,
            EINSUFFICIENT_BALANCE
        );
        coin::transfer<AptosCoin>(user, nft_collection.fee_recipient, mint_fee);
    };

    // Prepare token metadata
    let token_name = string::utf8(b"Course Completion Certificate: ");
    string::append(&mut token_name, course_name);

    let description = string::utf8(b"Certificate of completion for course: ");
    string::append(&mut description, course_name);
    string::append(&mut description, string::utf8(b" (ID: "));
    string::append(&mut description, course_id);
    string::append(&mut description, string::utf8(b")"));

    // Use a consistent URI for all tokens
    let token_uri = string::utf8(b"https://example.com/course-certificates/metadata.json");

    // Create the token
    let constructor_ref = token::create_from_account(
        user,
        nft_collection.collection_name,
        description,
        token_name,
        option::none(), // No royalty
        token_uri
    );

    let token_obj = object::object_from_constructor_ref<token::Token>(&constructor_ref);

    // Emit minting event
    event::emit(NFTMintedEvent {
        user_address: user_addr,
        course_id,
        course_name,
        token_id: token_obj,
        token_name,
        token_uri,
        completion_date: timestamp::now_seconds(),
        mint_fee,
    });
}
    
    // Admin functions

    // Function to update admin (optional)
    public entry fun update_admin(current_admin: &signer, new_admin: address) acquires ModuleData {
        let module_data = borrow_global_mut<ModuleData>(@course_platform);
        assert!(signer::address_of(current_admin) == module_data.admin, ENOT_AUTHORIZED);
        module_data.admin = new_admin;
    }

    public entry fun set_minting_enabled(admin: &signer, enabled: bool) acquires CourseCompletionNFTCollection {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @course_platform, ENOT_AUTHORIZED);

        let nft_collection = borrow_global_mut<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.minting_enabled = enabled;
    }

    public entry fun set_mint_fee(admin: &signer, new_fee: u64) acquires CourseCompletionNFTCollection {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @course_platform, ENOT_AUTHORIZED);

        let nft_collection = borrow_global_mut<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.mint_fee = new_fee;
    }

    public entry fun set_fee_recipient(admin: &signer, new_recipient: address) acquires CourseCompletionNFTCollection {
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @course_platform, ENOT_AUTHORIZED);

        let nft_collection = borrow_global_mut<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.fee_recipient = new_recipient;
    }

    // View functions
    #[view]
    public fun is_minting_enabled(): bool acquires CourseCompletionNFTCollection {
        let nft_collection = borrow_global<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.minting_enabled
    }

    #[view]
    public fun get_mint_fee(): u64 acquires CourseCompletionNFTCollection {
        let nft_collection = borrow_global<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.mint_fee
    }

    #[view]
    public fun get_fee_recipient(): address acquires CourseCompletionNFTCollection {
        let nft_collection = borrow_global<CourseCompletionNFTCollection>(@course_platform);
        nft_collection.fee_recipient
    }
}